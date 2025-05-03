import React, { useState, useEffect } from 'react';

export default function ResultsScreen({ data, onGoBack, onStartOver }) {
  const [journeyDate, setJourneyDate] = useState(new Date());
  const reportDateTime = new Date();

  useEffect(() => {
    console.log('✅ DEBUG: Received data →', data);
  }, [data]);

  const incrementDay = () => {
    const newDate = new Date(journeyDate);
    newDate.setDate(newDate.getDate() + 1);
    setJourneyDate(newDate);
  };

  const decrementDay = () => {
    const newDate = new Date(journeyDate);
    newDate.setDate(newDate.getDate() - 1);
    setJourneyDate(newDate);
  };

  const formatDate = (date) => date.toLocaleDateString();
  const formatDateTime = (date) => date.toLocaleString();

  const safe = (value, decimals = 2) =>
    typeof value === 'number'
      ? value.toFixed(decimals)
      : Number(value) > 0
      ? Number(value).toFixed(decimals)
      : '0.00';

  const storeFCAMap = {
    Drumm: 2000,
    Soma: 2000,
    Moscone: 1000,
    Gary: 1500
  };

  const totalCashBox = Number(data.totalCashBox || 0);
  const totalRegister = Number(data.totalRegister || 0);
  const expenses = data.expenses || [];
  const storeFCA = storeFCAMap[data.store] || 0;
  const posClockOut = Number(data.posClockOut || 0);

  const totalCash = totalCashBox + totalRegister;
  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const totalBalance = totalCash - totalExpenses - storeFCA;
  const errorFactor = totalBalance - posClockOut;

  const getSuggestedTray = (amount) => {
    const denominations = [20, 10, 5, 1];
    const suggestion = {};
    let remaining = amount;

    denominations.forEach((denom) => {
      const count = Math.floor(remaining / denom);
      if (count > 0) {
        suggestion[`$${denom}`] = count;
        remaining -= count * denom;
      }
    });

    const coins = [
      { label: 'Quarters', value: 0.25, roll: 10 },
      { label: 'Dimes', value: 0.10, roll: 5 },
      { label: 'Nickels', value: 0.05, roll: 2 },
      { label: 'Pennies', value: 0.01, roll: 0.5 }
    ];

    coins.forEach((coin) => {
      const coinAmount = Math.floor(remaining / coin.roll) * coin.roll;
      if (coinAmount > 0) {
        suggestion[coin.label] = coinAmount / coin.value;
        remaining -= coinAmount;
      }
    });

    return suggestion;
  };

  const traySuggestion = getSuggestedTray(storeFCA);

  const displayValue = (value) =>
    value !== null && value !== undefined ? `$${safe(value)}` : '[No data]';

  return (
    <div className="p-4 max-w-3xl mx-auto bg-gray-100 min-h-screen font-roboto">
      <h1 className="text-2xl font-thin mb-6 text-center">CCT Express Report</h1>

      {/* Report Information */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2 text-left">Report Information</h2>
        <div className="flex justify-between">
          <span>Store Name:</span>
          <span>{data.store || ''}</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier:</span>
          <span>{data.cashier || ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Journey Report Date:</span>
          <div className="flex items-center space-x-2">
            <button onClick={decrementDay} className="bg-gray-400 text-white px-2 rounded">-</button>
            <input type="text" readOnly value={formatDate(journeyDate)} className="border rounded px-2 py-1 w-32 text-center bg-gray-100" />
            <button onClick={incrementDay} className="bg-gray-400 text-white px-2 rounded">+</button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span>Report Date and Time:</span>
          <input type="text" readOnly value={formatDateTime(reportDateTime)} className="border rounded px-2 py-1 w-48 text-center bg-gray-100" />
        </div>
      </section>

      {/* Cash In */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2 text-left">Cash In</h2>
        <div className="flex justify-between">
          <span>Total Cash Box:</span>
          <span>{displayValue(totalCashBox)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total POS Register:</span>
          <span>{displayValue(totalRegister)}</span>
        </div>
      </section>

      {/* Cash Out */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2 text-left">Cash Out</h2>
        {expenses.length > 0 ? (
          <>
            {expenses.map((exp, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{exp.description || 'Unnamed expense'}:</span>
                <span>${safe(exp.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between mt-2 font-semibold text-red-500">
              <span>Total Cash Out:</span>
              <span>${safe(totalExpenses)}</span>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center">No expenses reported</div>
        )}
      </section>

      {/* Journey Balance */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2 text-left">Journey Balance</h2>
        <div className="flex justify-between">
          <span>Total Cash in Store (Box + Register Tray):</span>
          <span>${safe(totalCash)}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Total Expenses:</span>
          <span>- ${safe(totalExpenses)}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Store FCA:</span>
          <span>- ${safe(storeFCA)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-semibold">Total Balance:</span>
          <span className="font-semibold">${safe(totalBalance)}</span>
        </div>
        <div className="flex justify-between">
          <span>POS Clock Out Report:</span>
          <span>- ${safe(posClockOut)}</span>
        </div>
        <div className={`flex justify-between ${Math.abs(errorFactor) > 0 ? 'text-red-500' : ''}`}>
          <span>Error Factor Amount:</span>
          <span>${safe(errorFactor)}</span>
        </div>
        <div className="text-sm italic text-center mt-1">(Must be 0 or close to 0)</div>
      </section>

      {/* Suggested Tray */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2 text-left">Suggested Tray</h2>
        {Object.keys(traySuggestion).length > 0 ? (
          Object.entries(traySuggestion).map(([denom, count], idx) => (
            <div key={idx} className="flex justify-between">
              <span>{denom}:</span>
              <span>{count}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center">No suggestion available</div>
        )}
      </section>

      {/* Action Items */}
      <section className="bg-white rounded-xl p-4 shadow mb-4">
        <h2 className="font-semibold mb-2 text-left">Action Items</h2>
        <ol className="list-decimal ml-6">
          <li className="mb-2">Please proceed with the deposit in a new Envelope containing:</li>
          <li className="ml-4 mb-2">Cash Deposit: ${safe(posClockOut)}</li>
          <li className="ml-4 mb-2">Attach the printed POS Clock Out Slip Report</li>
          <li className="ml-4 mb-2">
            Label the envelope with the following information:
            <div className="ml-4">
              Journey Date: {formatDate(journeyDate)} <br />
              Day: {data.day || ''} <br />
              POS Clock Out Cash Report: ${safe(posClockOut)} <br />
              Cashier: {data.cashier || ''}
            </div>
          </li>
        </ol>
        <div className="mt-4 italic text-center">
          Important: Please make sure that the envelope is being deposited in a secure and monitored spot inside the store.
        </div>
        <div className="mt-2 text-center font-semibold">
          Thanks for your services, <br />
          {data.store || 'Drumm Liquor Store'}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Generate PDF</button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded shadow">Share Report</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded shadow" onClick={onGoBack}>Go Back</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded shadow" onClick={onStartOver}>Start Over</button>
      </div>

      <footer className="text-center text-gray-500 text-sm mt-6">
        Powered by DebugX LLC ✨ | Build: v0.5.0
      </footer>
    </div>
  );
}
