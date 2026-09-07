import { useEffect, useState } from 'react';

const PLACEHOLDER = 'https://placehold.co/600x600?text=Famous+Hardware';

// Flipkart-style gallery: a vertical thumbnail rail (horizontal on mobile) next to a large
// main image. `resetKey` (e.g. the selected variant's id) re-selects the first image whenever
// the underlying image set changes, so switching variants doesn't leave a stale image active.
const ImageGallery = ({ images, alt, resetKey }) => {
  const gallery = (images || []).filter(Boolean);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [resetKey]);

  const mainImage = gallery[active] || PLACEHOLDER;

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      {gallery.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 sm:w-16 shrink-0 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
          {gallery.map((img, index) => (
            <button
              key={img + index}
              type="button"
              onClick={() => setActive(index)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                index === active ? 'border-brand-500' : 'border-ink-200 hover:border-ink-300'
              }`}
            >
              <img src={img} alt={`${alt} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 aspect-square bg-white rounded-2xl overflow-hidden border border-ink-100 shadow-card group">
        <img
          src={mainImage}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default ImageGallery;
