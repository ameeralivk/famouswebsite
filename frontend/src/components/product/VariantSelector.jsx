const VariantSelector = ({ variants, selectedId, onSelect }) => (
  <div className="flex flex-wrap gap-2.5">
    {variants.map((variant) => {
      const outOfStock = variant.stockQuantity <= 0;
      const isSelected = variant._id === selectedId;

      return (
        <button
          key={variant._id}
          type="button"
          disabled={outOfStock}
          onClick={() => onSelect(variant._id)}
          className={[
            'px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all',
            isSelected
              ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-card'
              : 'border-ink-200 text-ink-700 hover:border-brand-300 hover:bg-brand-50/40',
            outOfStock ? 'opacity-40 cursor-not-allowed line-through hover:border-ink-200 hover:bg-transparent' : ''
          ].join(' ')}
          title={outOfStock ? 'Out of stock' : `₹${variant.price}`}
        >
          {variant.variantName}
        </button>
      );
    })}
  </div>
);

export default VariantSelector;
