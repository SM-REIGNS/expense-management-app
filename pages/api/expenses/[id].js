// PUT /api/expenses/:id -> update
// DELETE /api/expenses/:id -> delete

import { connectToDatabase } from '../../../lib/db';
import Expense from '../../../lib/models/Expense';
import { getUserFromRequest } from '../../../lib/auth';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { id } = req.query;
  const method = req.method;

  const userData = getUserFromRequest(req);
  if (!userData || !userData.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid expense ID' });
  }

  await connectToDatabase();

  try {
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (String(expense.userId) !== String(userData.userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (method === 'PUT') {
      const { title, amount, date } = req.body || {};

      // ✅ validation
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: 'Title is required (string)' });
      }
      if (amount == null || isNaN(amount)) {
        return res.status(400).json({ message: 'Amount must be a number' });
      }
      if (date && isNaN(Date.parse(date))) {
        return res.status(400).json({ message: 'Date must be valid ISO string' });
      }

      expense.title = title.trim();
      expense.amount = Number(amount);
      expense.date = date ? new Date(date) : expense.date;

      await expense.save();
      return res.status(200).json({ expense });
    }

    if (method === 'DELETE') {
      await expense.deleteOne();
      return res.status(200).json({ message: 'Deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Expense [id] error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
