// Mongoose User model

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
