import ProductCard from './ProductCard.jsx';

const SkeletonCard = () => (
  <div className="border border-ink-100 rounded-2xl overflow-hidden bg-white animate-pulse">
    <div className="aspect-square bg-ink-100" />
    <div className="p-3.5 space-y-2">
      <div className="h-2.5 w-16 bg-ink-100 rounded" />
      <div className="h-3.5 w-full bg-ink-100 rounded" />
      <div className="h-3.5 w-2/3 bg-ink-100 rounded" />
      <div className="h-8 w-full bg-ink-100 rounded-lg mt-2" />
    </div>
  </div>
);

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
        <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-ink-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-ink-500 font-medium">No products found</p>
        <p className="text-ink-400 text-sm">Try a different search or browse another category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
