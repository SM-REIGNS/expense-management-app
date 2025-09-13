// One-time script to backfill "category" for old expenses

import { connectToDatabase } from '../lib/db.js';
import Expense from '../lib/models/Expense.js';

async function migrate() {
  try {
    await connectToDatabase();

    const result = await Expense.updateMany(
      { category: { $exists: false } }, // find expenses without category
      { $set: { category: 'Other' } }   // set default category
    );

    console.log(`✅ Migration complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
