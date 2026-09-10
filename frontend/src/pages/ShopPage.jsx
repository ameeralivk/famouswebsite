import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ProductGrid from '../components/product/ProductGrid.jsx';
import FilterSidebar from '../components/product/FilterSidebar.jsx';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'finalPrice', label: 'Price: Low to High' },
  { value: '-finalPrice', label: 'Price: High to Low' },
  { value: '-ratings', label: 'Top Rated' }
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const onSale = searchParams.get('onSale') === 'true';
  const inStock = searchParams.get('inStock') === 'true';
  const sort = searchParams.get('sort') || '-createdAt';

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [category, search, minPrice, maxPrice, onSale, inStock, sort]);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: { category, search, minPrice, maxPrice, onSale, inStock, sort, page, limit: 12 } })
      .then(({ data }) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search, minPrice, maxPrice, onSale, inStock, sort, page]);

  const handleSortChange = (e) => {
    const next = new URLSearchParams(searchParams);
    if (e.target.value === '-createdAt') next.delete('sort');
    else next.set('sort', e.target.value);
    setSearchParams(next);
  };

  const heading = search
    ? `Search results for "${search}"`
    : category
    ? category.replace(/-/g, ' ')
    : 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-1 -mr-1">
              <FilterSidebar />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div>
              <h2 className="text-xl font-display font-bold text-ink-900 capitalize">{heading}</h2>
              {pagination && <span className="text-sm text-ink-400">{pagination.total} items</span>}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 border border-ink-200 rounded-full px-4 py-2 text-sm font-medium text-ink-700 hover:border-brand-400 transition"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filters
              </button>

              <select
                value={sort}
                onChange={handleSortChange}
                className="border border-ink-200 rounded-full px-4 py-2 text-sm font-medium text-ink-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ProductGrid products={products} loading={loading} />

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                    p === page
                      ? 'bg-brand-gradient text-white shadow-card'
                      : 'bg-white border border-ink-200 text-ink-600 hover:border-brand-400 hover:text-brand-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-ink-50 overflow-y-auto p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-ink-900">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-ink-100 text-ink-500"
                aria-label="Close filters"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar onNavigate={() => setShowMobileFilters(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
