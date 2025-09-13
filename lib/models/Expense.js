// Mongoose Expense model

import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  category: {
    type: String,
    enum: ['Food', 'Rent', 'Travel', 'Shopping', 'Bills', 'Other'],
    default: 'Other',
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
