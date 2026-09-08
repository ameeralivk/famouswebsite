import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios.js';
import VariantSelector from '../components/product/VariantSelector.jsx';
import ImageGallery from '../components/product/ImageGallery.jsx';

const TRUST_BADGES = [
  { label: 'Genuine Product', icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
  { label: 'Store Pickup', icon: 'M3 9l9-6 9 6M4 10v9h16v-9' },
  { label: 'Secure Checkout', icon: 'M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 1 0-8 0v4h8z' }
];

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        const firstInStock = data.product.variants.find((v) => v.stockQuantity > 0) || data.product.variants[0];
        setSelectedVariantId(firstInStock?._id);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square bg-ink-100 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-3 w-24 bg-ink-100 rounded" />
          <div className="h-7 w-3/4 bg-ink-100 rounded" />
          <div className="h-8 w-32 bg-ink-100 rounded" />
          <div className="h-20 w-full bg-ink-100 rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-500 font-medium">Product not found.</p>
        <Link to="/" className="text-brand-600 font-semibold hover:underline mt-2 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v._id === selectedVariantId) || product.variants[0];
  const galleryImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : product.mainImage
    ? [product.mainImage]
    : [];
  const inStock = selectedVariant?.stockQuantity > 0;

  const addToCart = async () => {
    setMessage('');
    try {
      await api.post('/cart/items', { productId: product._id, variantId: selectedVariant._id, quantity: 1 });
      setMessage('success');
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { state: { from: location, message: 'Please sign in to add items to your cart.' } });
        return;
      }
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-28 sm:pb-10">
      <nav className="text-xs text-ink-400 mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <span>/</span>
        {product.category?.name && <span className="text-ink-500">{product.category.name}</span>}
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        <ImageGallery images={galleryImages} alt={product.name} resetKey={selectedVariant?._id} />

        <div>
          {product.category?.name && (
            <span className="text-[11px] text-brand-600 font-bold uppercase tracking-[0.1em]">{product.category.name}</span>
          )}
          <h1 className="text-2xl sm:text-[1.85rem] font-display font-bold text-ink-900 mt-2 leading-tight tracking-tight">
            {product.name}
          </h1>
          {product.brand && (
            <p className="text-sm text-ink-500 mt-2">
              Brand: <span className="font-semibold text-ink-700">{product.brand}</span>
            </p>
          )}

          {product.ratings > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className={`w-4 h-4 ${i < Math.round(product.ratings) ? 'text-amber-400 fill-amber-400' : 'text-ink-200 fill-ink-200'}`}
                  >
                    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L6 21l1.6-7L2.2 9.2l7.1-.6L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-ink-500 font-medium">{product.ratings.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-6 pb-6 border-b border-ink-100">
            <span className="text-[2rem] font-display font-extrabold text-ink-900 tabular-nums">₹{selectedVariant?.price}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-ink-400 line-through text-lg tabular-nums">
                  ₹{product.basePrice + (selectedVariant?.additionalPrice || 0)}
                </span>
                <span className="text-xs font-bold text-white bg-green-600 px-2.5 py-1 rounded-full">
                  {product.discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-ink-600 mt-6 text-sm leading-relaxed">{product.description}</p>

          <div className="mt-7">
            <h3 className="text-sm font-semibold text-ink-700 mb-2.5">Select Variant</h3>
            <VariantSelector variants={product.variants} selectedId={selectedVariant?._id} onSelect={setSelectedVariantId} />
          </div>

          <p className="mt-5 text-sm flex items-center gap-1.5">
            {inStock ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-700 font-medium">In stock &middot; {selectedVariant.stockQuantity} available</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-500 font-medium">Out of stock</span>
              </>
            )}
          </p>

          <button
            onClick={addToCart}
            disabled={!selectedVariant || !inStock}
            className="hidden sm:inline-flex mt-7 items-center justify-center gap-2 w-full sm:w-auto px-10 py-3.5 bg-brand-gradient disabled:opacity-40 disabled:grayscale text-white font-semibold rounded-full shadow-card hover:opacity-90 hover:shadow-card-hover transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Add to Cart
          </button>

          {message === 'success' && (
            <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3.5 py-2.5 inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              Added to cart!
            </p>
          )}
          {message && message !== 'success' && (
            <p className="mt-4 text-sm text-ink-500">{message}</p>
          )}

          <div className="mt-8 pt-6 border-t border-ink-100 grid grid-cols-3 gap-3">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center gap-1.5">
                <span className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={badge.icon} />
                  </svg>
                </span>
                <span className="text-[11px] text-ink-500 font-medium leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky mobile add-to-cart bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-ink-100 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] z-20">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-ink-400 leading-none">Price</p>
          <p className="font-display font-bold text-ink-900 tabular-nums">₹{selectedVariant?.price}</p>
        </div>
        <button
          onClick={addToCart}
          disabled={!selectedVariant || !inStock}
          className="flex-1 py-3 bg-brand-gradient disabled:opacity-40 disabled:grayscale text-white font-semibold rounded-full shadow-card transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
