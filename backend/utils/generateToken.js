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
    // Frontend and backend deploy as separate Vercel projects on different domains, so this must
    // be 'none' in production (paired with secure: true above) or the browser won't send the
    // cookie on cross-origin requests. 'lax' is fine for local dev where both run on localhost.
    sameSite: isProd ? 'none' : 'lax',
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
