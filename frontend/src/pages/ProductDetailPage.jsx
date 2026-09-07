import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios.js';
import VariantSelector from '../components/product/VariantSelector.jsx';
import ImageGallery from '../components/product/ImageGallery.jsx';

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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-xs text-ink-400 mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        {product.category?.name && <span>{product.category.name}</span>}
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <ImageGallery images={galleryImages} alt={product.name} resetKey={selectedVariant?._id} />

        <div>
          {product.category?.name && (
            <span className="text-xs text-brand-600 font-bold uppercase tracking-wider">{product.category.name}</span>
          )}
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mt-1.5 leading-tight">{product.name}</h1>
          {product.brand && <p className="text-sm text-ink-500 mt-1.5">Brand: <span className="font-medium text-ink-700">{product.brand}</span></p>}

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-display font-extrabold text-ink-900">₹{selectedVariant?.price}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-ink-400 line-through text-lg">
                  ₹{product.basePrice + (selectedVariant?.additionalPrice || 0)}
                </span>
                <span className="text-sm font-bold text-white bg-green-600 px-2 py-0.5 rounded-full">
                  {product.discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-ink-600 mt-5 text-sm leading-relaxed">{product.description}</p>

          <div className="mt-7">
            <h3 className="text-sm font-semibold text-ink-700 mb-2.5">Select Variant</h3>
            <VariantSelector variants={product.variants} selectedId={selectedVariant?._id} onSelect={setSelectedVariantId} />
          </div>

          <p className="mt-5 text-sm flex items-center gap-1.5">
            {selectedVariant?.stockQuantity > 0 ? (
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
            disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
            className="mt-7 w-full sm:w-auto px-10 py-3.5 bg-brand-gradient disabled:opacity-40 disabled:grayscale text-white font-semibold rounded-full shadow-card hover:opacity-90 transition"
          >
            Add to Cart
          </button>

          {message === 'success' && (
            <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2 inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              Added to cart!
            </p>
          )}
          {message && message !== 'success' && (
            <p className="mt-3 text-sm text-ink-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
