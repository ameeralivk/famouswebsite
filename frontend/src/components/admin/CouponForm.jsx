import { useState } from 'react';
import api from '../../api/axios.js';

const initialState = {
  code: '',
  discountType: 'percentage',
  discountValue: 0,
  minOrderValue: 0,
  maxDiscountAmount: '',
  validFrom: '',
  validUntil: '',
  usageLimit: ''
};

const inputClass =
  'w-full border border-ink-200 rounded-lg px-3.5 py-2.5 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition';
const labelClass = 'block text-sm font-medium text-ink-700 mb-1.5';

const CouponForm = ({ onSaved, onCancel }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/coupons', {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue) || 0,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null
      });
      setForm(initialState);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-ink-100 rounded-2xl shadow-card p-6 space-y-5">
      <h2 className="text-lg font-display font-bold text-ink-900">New Coupon</h2>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Code</label>
          <input name="code" value={form.code} onChange={handleChange} required className={`${inputClass} uppercase`} />
        </div>

        <div>
          <label className={labelClass}>Discount Type</label>
          <select name="discountType" value={form.discountType} onChange={handleChange} className={inputClass}>
            <option value="percentage">Percentage</option>
            <option value="flat">Flat Amount</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Discount Value</label>
          <input type="number" name="discountValue" value={form.discountValue} onChange={handleChange} required min={0} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Min Order Value (₹)</label>
          <input type="number" name="minOrderValue" value={form.minOrderValue} onChange={handleChange} min={0} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Max Discount Cap (₹, optional)</label>
          <input type="number" name="maxDiscountAmount" value={form.maxDiscountAmount} onChange={handleChange} min={0} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Usage Limit (optional)</label>
          <input type="number" name="usageLimit" value={form.usageLimit} onChange={handleChange} min={0} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Valid From</label>
          <input type="date" name="validFrom" value={form.validFrom} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Valid Until</label>
          <input type="date" name="validUntil" value={form.validUntil} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-brand-gradient hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-lg shadow-card transition"
        >
          {submitting ? 'Creating...' : 'Create Coupon'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-ink-200 rounded-lg text-ink-600 font-medium hover:bg-ink-50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CouponForm;
