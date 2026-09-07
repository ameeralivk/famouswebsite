import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Hero from '../components/layout/Hero.jsx';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: { category, search, page, limit: 12 } })
      .then(({ data }) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search, page]);

  const heading = search
    ? `Search results for "${search}"`
    : category
    ? category.replace(/-/g, ' ')
    : 'All Products';

  return (
    <div>
      {!search && !category && <Hero />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-bold text-ink-900 capitalize">{heading}</h2>
          {pagination && <span className="text-sm text-ink-400">{pagination.total} items</span>}
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
  );
};

export default HomePage;
