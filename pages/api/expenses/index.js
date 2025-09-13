// GET /api/expenses  -> list expenses
// POST /api/expenses -> create expense

import { connectToDatabase } from '../../../lib/db';
import Expense from '../../../lib/models/Expense';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  const userData = getUserFromRequest(req);
  if (!userData || !userData.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const expenses = await Expense.find({ userId: userData.userId })
        .sort({ date: -1 })
        .lean();
      return res.status(200).json({ expenses });
    } catch (err) {
      console.error('GET expenses', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, amount, category, date } = req.body || {};

      // basic validation
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: 'Title is required (string)' });
      }
      if (amount == null || isNaN(amount)) {
        return res.status(400).json({ message: 'Amount must be a number' });
      }
      if (date && isNaN(Date.parse(date))) {
        return res.status(400).json({ message: 'Date must be valid ISO string' });
      }

      if (!category) {
        return res.status(400).json({ message: 'Category is required' });
      }

      const expense = await Expense.create({
        title: title.trim(),
        amount: Number(amount),
        date: date ? new Date(date) : new Date(),
        category,
        userId: userData.userId,
      });

      return res.status(201).json({ expense });
    } catch (err) {
      console.error('POST expense', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
