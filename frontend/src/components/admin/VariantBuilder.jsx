import ImageUploader from './ImageUploader.jsx';

// Dynamic form to add/remove multiple variants for a product, each with its own SKU, price and stock.
const emptyVariant = () => ({
  variantName: '',
  sku: '',
  additionalPrice: 0,
  stockQuantity: 0,
  images: []
});

const fieldClass = 'w-full border border-ink-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition';
const labelClass = 'block text-xs font-semibold text-ink-500 mb-1';

const VariantBuilder = ({ variants, onChange, basePrice = 0, discountPercentage = 0 }) => {
  const updateVariant = (index, field, value) => {
    const next = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    onChange(next);
  };

  const addVariant = () => onChange([...variants, emptyVariant()]);

  const removeVariant = (index) => onChange(variants.filter((_, i) => i !== index));

  const computeFinalPrice = (additionalPrice) => {
    const preDiscount = basePrice + (Number(additionalPrice) || 0);
    const discount = (preDiscount * discountPercentage) / 100;
    return Math.round((preDiscount - discount) * 100) / 100;
  };

  return (
    <div className="space-y-3">
      {variants.map((variant, index) => (
        <div key={index} className="border border-ink-100 bg-ink-50/50 rounded-xl p-4 grid sm:grid-cols-5 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className={labelClass}>Variant Name</label>
            <input
              type="text"
              value={variant.variantName}
              onChange={(e) => updateVariant(index, 'variantName', e.target.value)}
              placeholder='e.g. "12W Cool Daylight"'
              className={fieldClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>SKU</label>
            <input type="text" value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} className={fieldClass} required />
          </div>

          <div>
            <label className={labelClass}>Price Adjustment (₹)</label>
            <input
              type="number"
              value={variant.additionalPrice}
              onChange={(e) => updateVariant(index, 'additionalPrice', e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Stock Qty</label>
            <input
              type="number"
              min={0}
              value={variant.stockQuantity}
              onChange={(e) => updateVariant(index, 'stockQuantity', e.target.value)}
              className={fieldClass}
              required
            />
          </div>

          <div className="sm:col-span-5 -mt-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1">
              This variant will sell for ₹{computeFinalPrice(variant.additionalPrice)}
            </span>
          </div>

          <div className="sm:col-span-4">
            <label className={labelClass}>Images</label>
            <ImageUploader
              images={variant.images || []}
              onChange={(images) => updateVariant(index, 'images', images)}
              label="Variant image"
            />
          </div>

          <button
            type="button"
            onClick={() => removeVariant(index)}
            disabled={variants.length === 1}
            className="text-sm font-medium text-red-500 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addVariant} className="text-sm font-semibold text-brand-600 hover:underline">
        + Add another variant
      </button>
    </div>
  );
};

export default VariantBuilder;
export { emptyVariant };
