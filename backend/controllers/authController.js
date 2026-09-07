import User from '../models/User.js';
import { setAuthCookie, clearAuthCookie } from '../utils/generateToken.js';

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, phone, password, role: 'user' });
    setAuthCookie(res, user);

    res.status(201).json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login (unified for user + admin)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    setAuthCookie(res, user);

    const redirectTo = user.role === 'admin' ? '/admin/dashboard' : '/';
    res.status(200).json({ user: user.toSafeObject(), redirectTo });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = async (_req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: 'Logged out' });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user.toSafeObject() });
};
