import { connectToDatabase } from '../../../lib/db';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
