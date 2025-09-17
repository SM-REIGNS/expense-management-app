// POST /api/auth/signup

import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../lib/db';
import User from '../../../lib/models/User';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, confirmPassword } = req.body || {};

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
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    await connectToDatabase();

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({ email: email.toLowerCase().trim(), passwordHash, verificationToken });


    // Send verification email
    const sent = await sendVerificationEmail(email, verificationToken);
    if (!sent) {
      return res.status(500).json({ message: 'Could not send verification email' });
    }

    return res.status(201).json({ message: 'Signup successful! Please check your email to verify your account.' });

  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
