import { useEffect, useState } from 'react';
import api from '../../api/axios.js';

const ShopGallery = () => {
  const [media, setMedia] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get('/shop-media')
      .then(({ data }) => setMedia(data.media))
      .catch(() => setMedia([]))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || media.length === 0) return null;

  const video = media.find((m) => m.type === 'video');
  const photos = media.filter((m) => m.type === 'image');

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <span className="inline-block text-brand-600 bg-brand-50 text-[11px] font-semibold tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full mb-3">
          Take a Look Around
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">Visit Our Shop</h2>
        <p className="text-ink-500 mt-2 max-w-lg mx-auto">A glimpse of Famous Hardware, Kodinhi — our shelves, our team, and our store.</p>
      </div>

      {video && (
        <div className={photos.length ? 'mb-12' : ''}>
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide mb-4">Shop Video</h3>
          <div className="rounded-2xl overflow-hidden border border-ink-100 shadow-card bg-black">
            <video src={video.url} controls className="w-full aspect-video object-cover" />
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide mb-4">Shop Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo._id} className="aspect-square rounded-xl overflow-hidden border border-ink-100 shadow-card group">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Famous Hardware shop'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ShopGallery;
