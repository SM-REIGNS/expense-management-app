// Lists expenses, allows create/edit/delete via ManageExpense
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import ManageExpense from './ManageExpenses';

function ExpenseRow({ expense, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
      <div>
        <div className="font-medium">{expense.title}</div>
        <div className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-indigo-600 font-semibold">₹ {expense.amount.toFixed(2)}</div>
        <button
          onClick={() => onEdit(expense)}
          className="text-sm text-blue-600 hover:underline"
        >Edit</button>
        <button
          onClick={() => onDelete(expense._id)}
          className="text-sm text-red-600 hover:underline"
        >Delete</button>
      </div>
    </div>
  );
}

export default function ExpenseDashboard() {
  const { expenses, fetchExpenses, deleteExpense } = useApp();
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // fetch on mount
    fetchExpenses();
  }, []);

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
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Your Expenses</h1>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Expense
        </button>
      </div>

      <div className="grid gap-3">
        {expenses.length === 0 ? (
          <div className="text-gray-500">No expenses yet — add one!</div>
        ) : (
          expenses.map((ex) => (
            <ExpenseRow key={ex._id} expense={ex} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
      </div>

      {open && (
        <ManageExpense
          expense={selected}
          onClose={() => { setOpen(false); setSelected(null); }}
        />
      )}
    </div>
  );
}
