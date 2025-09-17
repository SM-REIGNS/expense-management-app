import { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ManageExpense from './ManageExpenses';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function ExpenseRow({ expense, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
      <div>
        <div className="font-medium">{expense.title}</div>
        <div className="text-sm text-gray-500">
          {new Date(expense.date).toLocaleDateString()}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-indigo-600 font-semibold">₹ {expense.amount.toFixed(2)}</div>
        <button
          onClick={() => onEdit(expense)}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(expense._id)}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ExpenseDashboard() {
  const { expenses, fetchExpenses, deleteExpense } = useApp();
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  // filter state
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // JS month 0-11
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((ex) => {
      const d = new Date(ex.date);
      return d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
    });
  }, [expenses, month, year]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, ex) => sum + ex.amount, 0);
  }, [filteredExpenses]);

  const avgPerDay = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return totalAmount / daysInMonth;
  }, [totalAmount, month, year]);

  const highestCategory = useMemo(() => {
    if (filteredExpenses.length === 0) return null;
    const catTotals = {};
    filteredExpenses.forEach((ex) => {
      catTotals[ex.category || 'Other'] = (catTotals[ex.category || 'Other'] || 0) + ex.amount;
    });
    const [maxCat, maxVal] = Object.entries(catTotals).reduce(
      (a, b) => (b[1] > a[1] ? b : a)
    );
    return { category: maxCat, amount: maxVal };
  }, [filteredExpenses]);

  const largestExpense = useMemo(() => {
    if (filteredExpenses.length === 0) return null;
    return filteredExpenses.reduce((max, ex) => (ex.amount > max.amount ? ex : max), filteredExpenses[0]);
  }, [filteredExpenses]);


  // Pie Chart Data (group by title just for demo)
  const pieData = useMemo(() => {
    const groups = {};
    filteredExpenses.forEach((ex) => {
      groups[ex.category] = (groups[ex.category] || 0) + ex.amount;
    });
    return {
      labels: Object.keys(groups),
      datasets: [
        {
          data: Object.values(groups),
          backgroundColor: ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'],
        },
      ],
    };
  }, [filteredExpenses]);

  // Bar Chart Data (group by day of month)
  const barData = useMemo(() => {
    const days = {};
    filteredExpenses.forEach((ex) => {
      const d = new Date(ex.date).getDate();
      days[d] = (days[d] || 0) + ex.amount;
    });
    const labels = Array.from({ length: 31 }, (_, i) => i + 1);
    return {
      labels,
      datasets: [
        {
          label: 'Daily Spend',
          data: labels.map((d) => days[d] || 0),
          backgroundColor: '#6366F1',
        },
      ],
    };
  }, [filteredExpenses]);

  const handleEdit = (expense) => {
    setSelected(expense);
    setOpen(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Expenses</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-2 py-1 w-24"
        />
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-sm font-medium text-gray-500">Total</h2>
          <p className="text-xl font-bold text-indigo-600">
            ₹ {totalAmount.toFixed(2)}
          </p>
        </div>

        {/* Avg per day */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-sm font-medium text-gray-500">Avg / day</h2>
          <p className="text-xl font-bold text-green-600">
            ₹ {avgPerDay.toFixed(2)}
          </p>
        </div>

        {/* Highest category */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-sm font-medium text-gray-500">Top Category</h2>
          {highestCategory ? (
            <p className="text-xl font-bold text-purple-600">
              {highestCategory.category} ({highestCategory.amount.toFixed(2)})
            </p>
          ) : (
            <p className="text-gray-400">—</p>
          )}
        </div>

        {/* Largest expense */}
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-sm font-medium text-gray-500">Largest Expense</h2>
          {largestExpense ? (
            <p className="text-xl font-bold text-red-600">
              {largestExpense.title} ({largestExpense.amount.toFixed(2)})
            </p>
          ) : (
            <p className="text-gray-400">—</p>
          )}
        </div>
      </div>



      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Expenses by Category</h2>
          <Pie data={pieData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Daily Spend</h2>
          <Bar data={barData} />
        </div>
      </div>

      {/* List */}
      <div className="grid gap-3">
        {filteredExpenses.length === 0 ? (
          <div className="text-gray-500">No expenses for this period</div>
        ) : (
          filteredExpenses.map((ex) => (
            <ExpenseRow
              key={ex._id}
              expense={ex}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {open && (
        <ManageExpense
          expense={selected}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
