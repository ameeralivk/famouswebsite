import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-card border border-ink-100 animate-fade-in">
      <h1 className="text-2xl font-display font-bold text-ink-900 mb-1">Create account</h1>
      <p className="text-sm text-ink-500 mb-7">Join Famous Hardware, Kodinhi</p>

      {error && (
        <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">{error}</div>
      )}

      {[
        { name: 'name', label: 'Full name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', required: false },
        { name: 'password', label: 'Password', type: 'password', required: true }
      ].map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-sm font-medium text-ink-700 mb-1.5">{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            required={field.required}
            value={form[field.name]}
            onChange={handleChange}
            className="w-full border border-ink-200 rounded-lg px-3.5 py-2.5 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-3 bg-brand-gradient hover:opacity-90 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg shadow-card transition"
      >
        {submitting ? 'Creating account...' : 'Create account'}
      </button>

      <p className="mt-6 text-sm text-ink-500 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
