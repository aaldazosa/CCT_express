import { useState } from 'react';
import toast from 'react-hot-toast';

function Counter({ count, onChange, increment = 1, decrement = 1 }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onChange(Math.max(0, (count || 0) - decrement))}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center shadow transition text-sm"
      >
        –
      </button>
      <span className="w-8 text-center text-base font-semibold">{count || 0}</span>
      <button
        onClick={() => onChange((count || 0) + increment)}
        className="bg-blue-400 hover:bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow transition text-sm"
      >
        +
      </button>
    </div>
  );
}

export default function InputScreen({ onSubmit }) {
  const [cashier, setCashier] = useState('');
  const [store, setStore] = useState('Drumm');
  const [metalBoxCounts, setMetalBoxCounts] = useState({});
  const [metalBoxTotals, setMetalBoxTotals] = useState({});
  const [registerCounts, setRegisterCounts] = useState({});
  const [registerTotals, setRegisterTotals] = useState({});
  const [expenses, setExpenses] = useState([{ description: '', amount: 0 }]);
  const [posClockOut, setPosClockOut] = useState(0);

  const denominations = [
    { label: '$100', value: 100 },
    { label: '$50', value: 50 },
    { label: '$20', value: 20 },
    { label: '$10', value: 10 },
    { label: '$5', value: 5 },
    { label: '$1', value: 1 },
    { label: 'Quarters', value: 0.25 },
    { label: 'Dimes', value: 0.10 },
    { label: 'Nickels', value: 0.05 },
    { label: 'Pennies', value: 0.01 },
  ];

  const handleCountChange = (section, denom, newCount, countSetter, totalSetter) => {
    const total = newCount * denom.value;
    countSetter((prev) => ({ ...prev, [denom.label]: newCount }));
    totalSetter((prev) => ({ ...prev, [denom.label]: total }));
    toast.success(`✅ ${denom.label}: $${total.toFixed(2)}`);
  };

  const getSectionTotal = (totals) =>
    Object.values(totals).reduce((sum, val) => sum + val, 0);

  const SectionBlock = ({ title, counts, totals, countSetter, totalSetter }) => (
    <div className="mb-6 bg-white rounded-xl p-4 shadow">
      <h3 className="font-semibold text-center mb-3">{title}</h3>
      {denominations.map((denom) => (
        <div key={`${title}-${denom.label}`} className="flex items-center justify-between mb-2">
          <span className="w-12">{denom.label}</span>
          <Counter
            count={counts[denom.label]}
            onChange={(newCount) =>
              handleCountChange(
                title === 'Metal Box Cash' ? 'metalBox' : 'register',
                denom,
                newCount,
                countSetter,
                totalSetter
              )
            }
          />
          <div className="bg-gray-200 p-2 rounded w-20 text-center text-sm">
            ${totals[denom.label]?.toFixed(2) || '0.00'}
          </div>
        </div>
      ))}
      <div className="text-right text-blue-500 text-sm font-light mt-2">
        Total {title}: ${getSectionTotal(totals).toFixed(2)}
      </div>
    </div>
  );

  const prepareSafeTotals = (totals) =>
    denominations.reduce((acc, denom) => {
      acc[denom.label] = totals[denom.label] || 0;
      return acc;
    }, {});

  const handleExpenseChange = (index, field, value) => {
    setExpenses((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  const addNewExpense = () => {
    setExpenses((prev) => [...prev, { description: '', amount: 0 }]);
  };

  const increasePosClockOut = (amount) => {
    setPosClockOut((prev) => {
      const updated = prev + amount;
      return updated >= 0 ? parseFloat(updated.toFixed(2)) : 0;
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 min-h-screen flex flex-col justify-center">
      <div className="text-center mb-6">
        <img src="/debugx-logo.png" alt="DebugX Logo" className="w-24 mx-auto mb-2" />
        <h1 className="text-3xl font-thin mb-1">CCT Express</h1>
        <h2 className="text-lg font-light mb-4">Closing Cashier Tool</h2>
      </div>

      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <h2 className="text-xl mb-4 text-center font-light">Cashier Name</h2>
        <input
          type="text"
          value={cashier}
          onChange={(e) => setCashier(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          placeholder="Enter cashier name"
        />
      </div>

      <SectionBlock
        title="Metal Box Cash"
        counts={metalBoxCounts}
        totals={metalBoxTotals}
        countSetter={setMetalBoxCounts}
        totalSetter={setMetalBoxTotals}
      />
      <SectionBlock
        title="Register Cash"
        counts={registerCounts}
        totals={registerTotals}
        countSetter={setRegisterCounts}
        totalSetter={setRegisterTotals}
      />

      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <h3 className="text-2xl font-semibold text-center">
          Total Cash: ${(
            getSectionTotal(metalBoxTotals) + getSectionTotal(registerTotals)
          ).toFixed(2)}
        </h3>
      </div>

      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">POS Clock Out Cash</h3>
          <input
            type="text"
            value={`$${posClockOut.toFixed(2)}`}
            readOnly
            className="border p-2 rounded bg-gray-100 text-center font-semibold w-32"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => increasePosClockOut(100)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full shadow text-sm">+100</button>
          <button onClick={() => increasePosClockOut(10)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full shadow text-sm">+10</button>
          <button onClick={() => increasePosClockOut(1)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full shadow text-sm">+1</button>
          <button onClick={() => increasePosClockOut(0.25)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-full shadow text-sm">+0.25</button>
          <button onClick={() => increasePosClockOut(-100)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full shadow text-sm">-100</button>
          <button onClick={() => increasePosClockOut(-10)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full shadow text-sm">-10</button>
          <button onClick={() => increasePosClockOut(-1)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full shadow text-sm">-1</button>
          <button onClick={() => increasePosClockOut(-0.25)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full shadow text-sm">-0.25</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <h3 className="font-semibold mb-2">Expenses</h3>
        {expenses.map((exp, idx) => (
          <div key={idx} className="mb-2 flex items-center space-x-2">
            <input
              type="text"
              value={exp.description}
              onChange={(e) => handleExpenseChange(idx, 'description', e.target.value)}
              className="border p-2 rounded w-1/2"
              placeholder="Description"
            />
            <Counter
              count={exp.amount}
              onChange={(val) => handleExpenseChange(idx, 'amount', val)}
              increment={10}
              decrement={1}
            />
          </div>
        ))}
        <button
          onClick={addNewExpense}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add New Expense
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <h3 className="font-semibold mb-2">Store</h3>
        <select
          value={store}
          onChange={(e) => setStore(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option>Drumm</option>
          <option>Soma</option>
          <option>Moscone</option>
          <option>Gary</option>
        </select>
      </div>

      {/* ✅ FIXED EXPORT BLOCK */}
      <button
        onClick={() =>
          onSubmit({
            cashier,
            store,
            metalBox: prepareSafeTotals(metalBoxTotals),
            register: prepareSafeTotals(registerTotals),
            totalCashBox: getSectionTotal(metalBoxTotals),
            totalRegister: getSectionTotal(registerTotals),
            expenses,
            posClockOut,
          })
        }
        className="bg-green-500 text-white py-3 px-6 rounded-xl w-full shadow-lg hover:bg-green-600 transition"
      >
        Calculate
      </button>

      <footer className="text-center text-gray-500 text-sm mt-6">
        Powered by DebugX LLC ✨ | Build: v0.1.9 + FIX
      </footer>
    </div>
  );
}
