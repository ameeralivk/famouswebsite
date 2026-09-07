import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// Unified login for both customers and admins; backend decides the role-based redirect.
const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const infoMessage = location.state?.message;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { user, redirectTo } = await login(form.email, form.password);
      const from = location.state?.from?.pathname;
      navigate(from || redirectTo || (user.role === 'admin' ? '/admin/dashboard' : '/'), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-card border border-ink-100 animate-fade-in">
      <h1 className="text-2xl font-display font-bold text-ink-900 mb-1">Welcome back</h1>
      <p className="text-sm text-ink-500 mb-6">Sign in to continue to Famous Hardware</p>

      {infoMessage && !error && (
        <div className="mb-5 flex items-start gap-2.5 text-sm text-brand-800 bg-brand-50 border border-brand-100 rounded-lg px-3.5 py-3">
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 mt-0.5 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4m0-4h.01" />
          </svg>
          <span>{infoMessage}</span>
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-2.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-3">
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
      <input
        type="email"
        name="email"
        required
        value={form.email}
        onChange={handleChange}
        className="w-full border border-ink-200 rounded-lg px-3.5 py-2.5 mb-4 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
        placeholder="you@example.com"
      />

      <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
      <input
        type="password"
        name="password"
        required
        value={form.password}
        onChange={handleChange}
        className="w-full border border-ink-200 rounded-lg px-3.5 py-2.5 mb-7 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
        placeholder="••••••••"
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-gradient hover:opacity-90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg shadow-card transition"
      >
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="mt-6 text-sm text-ink-500 text-center">
        New here?{' '}
        <Link to="/register" className="text-brand-600 font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
