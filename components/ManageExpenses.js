// Form to add/edit an expense. Uses context methods.

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function ManageExpense({ expense = null, onClose }) {
  const isEdit = Boolean(expense);
  const { createExpense, updateExpense } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (isEdit) {
      setTitle(expense.title || '');
      setAmount(String(expense.amount || ''));
      setDate(new Date(expense.date).toISOString().slice(0, 10));
    } else {
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, amount: Number(amount), date };

    if (isEdit) {
      await updateExpense(expense._id, payload);
    } else {
      await createExpense(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div className="bg-white rounded p-6 shadow-lg z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Expense' : 'Add Expense'}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm">
            Title
            <input required className="mt-1 block w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block text-sm">
            Amount
            <input required type="number" step="0.01" className="mt-1 block w-full border rounded px-3 py-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          <label className="block text-sm">
            Date
            <input required type="date" className="mt-1 block w-full border rounded px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">{isEdit ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
