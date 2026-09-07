import { useState } from 'react';
import api from '../../api/axios.js';
import ImageUploader from './ImageUploader.jsx';

const initialState = { name: '', description: '', image: '' };

const inputClass =
  'w-full border border-ink-200 rounded-lg px-3.5 py-2.5 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition';
const labelClass = 'block text-sm font-medium text-ink-700 mb-1.5';

const CategoryForm = ({ onSaved }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/categories', form);
      setForm(initialState);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-ink-100 rounded-2xl shadow-card p-6 space-y-4">
      <h2 className="text-lg font-display font-bold text-ink-900">New Category</h2>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Hardware"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description (optional)</label>
          <input name="description" value={form.description} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Category Image</label>
        <ImageUploader
          images={form.image ? [form.image] : []}
          onChange={(images) => setForm({ ...form, image: images[0] || '' })}
          max={1}
          label="Category image"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2.5 bg-brand-gradient hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-lg shadow-card transition"
      >
        {submitting ? 'Creating...' : 'Create Category'}
      </button>
    </form>
  );
};

export default CategoryForm;
