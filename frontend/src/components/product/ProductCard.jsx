import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const hasDiscount = product.discountPercentage > 0;
  const thumbnail =
    product.mainImage || product.variants?.[0]?.images?.[0] || 'https://placehold.co/400x400?text=Famous+Hardware';
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) ?? 1;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative border border-ink-100 rounded-2xl overflow-hidden bg-white hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col animate-fade-in"
    >
      <div className="relative aspect-square bg-ink-50 overflow-hidden">
        <img
          src={thumbnail}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 bg-brand-gradient text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-card">
            {product.discountPercentage}% OFF
          </span>
        )}

        {totalStock <= 0 && (
          <span className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-ink-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </span>
        )}
      </div>

      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        {product.category?.name && (
          <span className="text-[11px] text-brand-600 font-bold uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        <h3 className="text-sm font-semibold text-ink-800 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {product.ratings > 0 && (
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-amber-400 fill-amber-400">
              <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L6 21l1.6-7L2.2 9.2l7.1-.6L12 2z" />
            </svg>
            <span className="text-xs text-ink-500 font-medium">
              {product.ratings.toFixed(1)} ({product.numReviews})
            </span>
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-display font-bold text-ink-900">₹{product.finalPrice}</span>
          {hasDiscount && <span className="text-xs text-ink-400 line-through">₹{product.basePrice}</span>}
        </div>

        <span className="mt-2.5 inline-flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-brand-700 bg-brand-50 group-hover:bg-brand-600 group-hover:text-white rounded-lg py-2 transition-colors">
          {product.variants?.length > 1 ? 'Select Options' : 'View Details'}
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
