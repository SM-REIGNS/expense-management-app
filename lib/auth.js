// JWT utilities and helpers for Next.js API routes.
// signToken -> create JWT
// verifyToken -> verify JWT
// getUserFromRequest(req) -> parse cookie or Authorization header and return payload { userId, email }
// NOTE: server-side only (should not be used in client bundle)

import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export function signToken(payload) {
  // Keep the payload small; include userId and email.
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function getTokenFromRequest(req) {
  // 1) Try cookies
  const header = req.headers?.cookie;
  if (header) {
    const parsed = cookie.parse(header || '');
    if (parsed.token) return parsed.token;
  }

  // 2) Try Authorization Bearer header (fallback)
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.split(' ')[1];
  }

  return null;
}

export function getUserFromRequest(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const payload = verifyToken(token);
  return payload; // { userId, email, iat, exp }
}
