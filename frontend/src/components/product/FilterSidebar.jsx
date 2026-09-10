import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios.js';

const FALLBACK_CATEGORIES = [
  { name: 'Hardware', slug: 'hardware' },
  { name: 'Sanitary', slug: 'sanitary' },
  { name: 'Lightings', slug: 'lightings' }
];

const ICONS = {
  hardware: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  sanitary: <path d="M4 12h16M6 12V6a2 2 0 0 1 2-2h2v3M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />,
  lightings: (
    <>
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" />
    </>
  ),
  all: <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm0 9h7v7h-7v-7zM4 13h7v7H4v-7z" />
};

const checkboxClass = 'w-4 h-4 rounded accent-brand-600';

// Flipkart-style filter rail: category list plus price/availability filters, all driven off
// URL search params so results, pagination, and the browser back button all stay in sync.
const FilterSidebar = ({ onNavigate }) => {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || '';
  const hasSearch = searchParams.has('search');

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [onSale, setOnSale] = useState(searchParams.get('onSale') === 'true');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => {
        if (data.categories?.length) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setOnSale(searchParams.get('onSale') === 'true');
    setInStock(searchParams.get('inStock') === 'true');
  }, [searchParams]);

  const selectCategory = (slug) => {
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    if (slug) next.set('category', slug);
    else next.delete('category');
    setSearchParams(next);
    onNavigate?.();
  };

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('minPrice', minPrice);
    else next.delete('minPrice');
    if (maxPrice) next.set('maxPrice', maxPrice);
    else next.delete('maxPrice');
    if (onSale) next.set('onSale', 'true');
    else next.delete('onSale');
    if (inStock) next.set('inStock', 'true');
    else next.delete('inStock');
    setSearchParams(next);
    onNavigate?.();
  };

  const clearAll = () => {
    setSearchParams({});
    onNavigate?.();
  };

  const hasActiveFilters =
    activeCategory || searchParams.get('minPrice') || searchParams.get('maxPrice') || onSale || inStock;

  const tabs = [{ name: 'All Categories', slug: '' }, ...categories];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-4">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wide mb-3">Categories</h3>
        <div className="space-y-0.5">
          {tabs.map((cat) => {
            const isActive = !hasSearch && activeCategory === cat.slug;
            return (
              <button
                key={cat.slug || 'all'}
                onClick={() => selectCategory(cat.slug)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                  isActive ? 'bg-brand-gradient text-white shadow-card' : 'text-ink-600 hover:bg-ink-50'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-500'}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[cat.slug || 'all'] || <circle cx="12" cy="12" r="9" />}
                </svg>
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-4">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wide mb-3">Price Range (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-ink-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
          />
          <span className="text-ink-300 shrink-0">&mdash;</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-ink-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
          />
        </div>
      </div>

      <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-4 space-y-2.5">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wide mb-1">Availability</h3>
        <label className="flex items-center gap-2.5 text-sm text-ink-700 cursor-pointer">
          <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} className={checkboxClass} />
          On Sale
        </label>
        <label className="flex items-center gap-2.5 text-sm text-ink-700 cursor-pointer">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className={checkboxClass} />
          In Stock Only
        </label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          className="flex-1 py-2.5 bg-brand-gradient hover:opacity-90 text-white text-sm font-semibold rounded-full shadow-card transition"
        >
          Apply Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="px-4 py-2.5 border border-ink-200 text-ink-600 text-sm font-medium rounded-full hover:bg-ink-50 transition"
          >
            Clear
          </button>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
