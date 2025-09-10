// GET /api/auth/me
// Returns currently authenticated user based on HttpOnly cookie (token).
// This endpoint is helpful for client-side hydration/persisting login across reloads.

import { connectToDatabase } from '../../../lib/db';
import User from '../../../lib/models/User';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const userData = getUserFromRequest(req);
    if (!userData || !userData.userId) return res.status(401).json({ message: 'Not authenticated' });

    await connectToDatabase();
    const user = await User.findById(userData.userId).select('_id email');
    if (!user) return res.status(401).json({ message: 'User not found' });

    return res.status(200).json({ user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Me error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
