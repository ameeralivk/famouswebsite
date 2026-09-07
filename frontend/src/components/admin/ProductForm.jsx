import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import VariantBuilder, { emptyVariant } from './VariantBuilder.jsx';
import ImageUploader from './ImageUploader.jsx';

const initialState = {
  name: '',
  description: '',
  category: '',
  brand: '',
  mainImage: '',
  basePrice: 0,
  discountPercentage: 0,
  isFeatured: false,
  variants: [emptyVariant()]
};

const inputClass =
  'w-full border border-ink-200 rounded-lg px-3.5 py-2.5 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition';
const labelClass = 'block text-sm font-medium text-ink-700 mb-1.5';

const ProductForm = ({ product, onSaved, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        category: product.category?._id || product.category,
        brand: product.brand || '',
        mainImage: product.mainImage || '',
        basePrice: product.basePrice,
        discountPercentage: product.discountPercentage,
        isFeatured: product.isFeatured,
        variants: product.variants.map((v) => ({
          variantName: v.variantName,
          sku: v.sku,
          additionalPrice: v.additionalPrice,
          stockQuantity: v.stockQuantity,
          images: v.images || []
        }))
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form, basePrice: Number(form.basePrice), discountPercentage: Number(form.discountPercentage) };
      if (product) {
        await api.put(`/products/${product._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-ink-100 rounded-2xl shadow-card p-6 space-y-5">
      <h2 className="text-lg font-display font-bold text-ink-900">{product ? 'Edit Product' : 'New Product'}</h2>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select name="category" value={form.category} onChange={handleChange} required className={inputClass}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-ink-500 mt-1.5">
              No categories yet.{' '}
              <Link to="/admin/categories" className="text-brand-600 font-medium hover:underline">
                Create one first
              </Link>
              .
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Base Price (₹)</label>
          <input type="number" name="basePrice" value={form.basePrice} onChange={handleChange} required min={0} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Discount %</label>
          <input
            type="number"
            name="discountPercentage"
            value={form.discountPercentage}
            onChange={handleChange}
            min={0}
            max={100}
            className={inputClass}
          />
        </div>

        <label className="flex items-center gap-2 mt-7 text-sm text-ink-700 font-medium">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-brand-600" />
          Featured product
        </label>
      </div>

      <div>
        <label className={labelClass}>Main Product Image</label>
        <p className="text-xs text-ink-400 mb-2">
          Shown on the product grid and as the default detail-page image before a variant is picked.
        </p>
        <ImageUploader
          images={form.mainImage ? [form.mainImage] : []}
          onChange={(images) => setForm({ ...form, mainImage: images[0] || '' })}
          max={1}
          label="Main image"
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink-700 mb-3">Variants</h3>
        <VariantBuilder variants={form.variants} onChange={(variants) => setForm({ ...form, variants })} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-brand-gradient hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-lg shadow-card transition"
        >
          {submitting ? 'Saving...' : 'Save Product'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-ink-200 rounded-lg text-ink-600 font-medium hover:bg-ink-50 transition">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
