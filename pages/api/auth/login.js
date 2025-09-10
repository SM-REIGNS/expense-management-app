// POST /api/auth/login
// Validates credentials, sets JWT cookie, returns user info.

import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../lib/db';
import User from '../../../lib/models/User';
import { signToken } from '../../../lib/auth';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  // Validation
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email is required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ userId: user._id, email: user.email });

    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }));

    return res.status(200).json({ user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
