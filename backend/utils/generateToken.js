import jwt from 'jsonwebtoken';

export const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

export const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd, // requires HTTPS in production
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  };
};

export const setAuthCookie = (res, user) => {
  const token = generateToken(user);
  res.cookie(process.env.COOKIE_NAME || 'fh_token', token, cookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'fh_token', { ...cookieOptions(), maxAge: undefined });
};
