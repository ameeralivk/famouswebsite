import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import VideoUploader from '../../components/admin/VideoUploader.jsx';

const AdminGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState('');
  const [newVideo, setNewVideo] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadMedia = () => {
    api.get('/shop-media').then(({ data }) => setMedia(data.media));
  };

  useEffect(() => {
    setLoading(true);
    api
      .get('/shop-media')
      .then(({ data }) => setMedia(data.media))
      .finally(() => setLoading(false));
  }, []);

  const saveMedia = async (url, type) => {
    setSaving(true);
    setError('');
    try {
      await api.post('/shop-media', { url, type, order: media.length });
      loadMedia();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save media');
    } finally {
      setSaving(false);
      setNewImage('');
      setNewVideo('');
    }
  };

  const handleImageChange = (images) => {
    const url = images[0];
    setNewImage(url || '');
    if (url) saveMedia(url, 'image');
  };

  const handleVideoChange = (url) => {
    setNewVideo(url);
    if (url) saveMedia(url, 'video');
  };

  const handleDelete = async (item) => {
    if (!confirm('Remove this from the shop gallery?')) return;
    await api.delete(`/shop-media/${item._id}`);
    loadMedia();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-ink-900">Shop Gallery</h1>
      <p className="text-sm text-ink-500 -mt-4">Photos and a video shown in the "Visit Our Shop" section on the homepage.</p>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-ink-700 mb-3">Add Photo</h2>
          <ImageUploader images={newImage ? [newImage] : []} onChange={handleImageChange} max={1} label="Shop photo" />
        </div>

        <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-5">
          <h2 className="text-sm font-semibold text-ink-700 mb-3">Add Video</h2>
          <VideoUploader value={newVideo} onChange={handleVideoChange} />
        </div>
      </div>

      {saving && <p className="text-xs text-ink-400">Saving...</p>}

      <div>
        <h2 className="text-sm font-semibold text-ink-700 mb-3">Gallery ({media.length})</h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-ink-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !media.length ? (
          <p className="text-sm text-ink-400">No photos or videos added yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {media.map((item) => (
              <div key={item._id} className="relative aspect-square rounded-xl overflow-hidden border border-ink-200 group">
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={item.url} alt="Shop" className="w-full h-full object-cover" />
                )}
                {item.type === 'video' && (
                  <span className="absolute bottom-1.5 left-1.5 bg-ink-900/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Video
                  </span>
                )}
                <button
                  onClick={() => handleDelete(item)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-ink-900/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
