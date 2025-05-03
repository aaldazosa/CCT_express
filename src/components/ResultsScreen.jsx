import React, { useState, useEffect } from 'react';

export default function ResultsScreen({ data, onGoBack, onStartOver }) {
  const [journeyDate, setJourneyDate] = useState(new Date());
  const reportDateTime = new Date();

  useEffect(() => {
    console.log('✅ DEBUG: Received data →', data);
  }, [data]);

  const incrementDay = () => setJourneyDate(new Date(journeyDate.setDate(journeyDate.getDate() + 1)));
  const decrementDay = () => setJourneyDate(new Date(journeyDate.setDate(journeyDate.getDate() - 1)));
  const formatDate = (date) => date.toLocaleDateString();
  const formatDateTime = (date) => date.toLocaleString();
  const safe = (value) => Number(value || 0).toFixed(2);

  const storeFCAMap = { Drumm: 2000, Soma: 2000, Moscone: 1000, Gary: 1500 };
  const totalCashBox = Number(data.totalCashBox || 0);
  const totalRegister = Number(data.totalRegister || 0);
  const expenses = data.expenses || [];
  const storeFCA = storeFCAMap[data.store] || 0;
  const posClockOut = Number(data.posClockOut || 0);
  const totalCash = totalCashBox + totalRegister;
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const totalBalance = totalCash - totalExpenses - storeFCA;
  const errorFactor = totalBalance - posClockOut;

  function calculateSuggestedTray() {
    const envelopeAmount = totalCash - storeFCA - totalExpenses;
    const registerNeeded = storeFCA - totalCashBox;

    const registerDenoms = [20, 10, 5, 1];
    const envelopeDenoms = [100, 50, 20];
    const treasuryRolls = { Q: 10, D: 5, N: 2, P: 0.5 };
    const maxFajo = 2;

    let register = {}, envelope = {};
    let regRemaining = registerNeeded, envRemaining = envelopeAmount;

    registerDenoms.forEach((d) => {
      let count = Math.min(Math.floor(regRemaining / d), maxFajo * 100);
      if (count > 0) { register[`$${d}`] = count; regRemaining -= count * d; }
    });

    envelopeDenoms.forEach((d) => {
      let count = Math.floor(envRemaining / d);
      if (count > 0) { envelope[`$${d}`] = count; envRemaining -= count * d; }
    });

    Object.entries(treasuryRolls).forEach(([coin, rollVal]) => {
      let rolls = Math.floor(regRemaining / rollVal);
      if (rolls > 0 && rolls <= maxFajo) {
        register[`${coin}`] = rolls;
        regRemaining -= rolls * rollVal;
      }
    });

    const leftover = regRemaining + envRemaining;
    return { register, envelope, leftover };
  }

  const { register, envelope, leftover } = calculateSuggestedTray();

  const displayValue = (v) => (v !== null && v !== undefined ? `$${safe(v)}` : '[No data]');

  return (
    <div className="p-4 max-w-3xl mx-auto bg-gray-100 min-h-screen font-roboto">
      <h1 className="text-2xl font-thin mb-6 text-center">CCT Express Report</h1>

      {/* Report Information */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2">Report Information</h2>
        <div className="flex justify-between"><span>Store Name:</span><span>{data.store}</span></div>
        <div className="flex justify-between"><span>Cashier:</span><span>{data.cashier}</span></div>
        <div className="flex justify-between items-center">
          <span>Journey Report Date:</span>
          <div className="flex items-center space-x-2">
            <button onClick={decrementDay} className="bg-gray-400 text-white px-2 rounded">-</button>
            <input readOnly value={formatDate(journeyDate)} className="border rounded px-2 py-1 w-32 text-center bg-gray-100" />
            <button onClick={incrementDay} className="bg-gray-400 text-white px-2 rounded">+</button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span>Report Date and Time:</span>
          <input readOnly value={formatDateTime(reportDateTime)} className="border rounded px-2 py-1 w-48 text-center bg-gray-100" />
        </div>
      </section>

      {/* Cash In */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2">Cash In</h2>
        <div className="flex justify-between"><span>Total Cash Box:</span><span>{displayValue(totalCashBox)}</span></div>
        <div className="flex justify-between"><span>Total POS Register:</span><span>{displayValue(totalRegister)}</span></div>
      </section>

      {/* Cash Out */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2">Cash Out</h2>
        {expenses.length ? expenses.map((exp, i) => (
          <div key={i} className="flex justify-between"><span>{exp.description}:</span><span>${safe(exp.amount)}</span></div>
        )) : <div className="text-center text-gray-500">No expenses reported</div>}
        <div className="flex justify-between mt-2 text-red-500 font-semibold">
          <span>Total Cash Out:</span><span>${safe(totalExpenses)}</span>
        </div>
      </section>

      {/* Journey Balance */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2">Journey Balance</h2>
        <div className="flex justify-between"><span>Total Cash in Store (Box + Register Tray):</span><span>${safe(totalCash)}</span></div>
        <div className="flex justify-between text-red-500"><span>Total Expenses:</span><span>- ${safe(totalExpenses)}</span></div>
        <div className="flex justify-between text-red-500"><span>Store FCA:</span><span>- ${safe(storeFCA)}</span></div>
        <div className="flex justify-between font-semibold mt-2"><span>Total Balance:</span><span>${safe(totalBalance)}</span></div>
        <div className="flex justify-between"><span>POS Clock Out Report:</span><span>- ${safe(posClockOut)}</span></div>
        <div className={`flex justify-between ${Math.abs(errorFactor) > 0 ? 'text-red-500' : ''}`}>
          <span>Error Factor Amount:</span><span>${safe(errorFactor)}</span>
        </div>
      </section>

      {/* Suggested Tray */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2">Suggested Tray</h2>
        <h3 className="font-semibold">Register Tray</h3>
        {Object.keys(register).map((d, i) => (
          <div key={i} className="flex justify-between"><span>{d}:</span><span>{register[d]}</span></div>
        ))}
        <h3 className="font-semibold mt-2">Envelope</h3>
        {Object.keys(envelope).map((d, i) => (
          <div key={i} className="flex justify-between"><span>{d}:</span><span>{envelope[d]}</span></div>
        ))}
        {leftover > 0 && (
          <div className="text-center text-red-500 mt-2">
            ⚠️ Check cash distribution — ${safe(leftover)} unallocated
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Generate PDF</button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded shadow">Share Report</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded shadow" onClick={onGoBack}>Go Back</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded shadow" onClick={onStartOver}>Start Over</button>
      </div>

      <footer className="text-center text-gray-500 text-sm mt-6">
        Powered by DebugX LLC ✨ | Build: v0.5.3
      </footer>
    </div>
  );
}
