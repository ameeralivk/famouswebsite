import { useRef, useState } from 'react';
import api from '../../api/axios.js';

// Lets an admin attach up to `max` images; files are uploaded straight to Cloudinary via the
// backend, and only the resulting secure URLs are kept on the form. Pass max=1 for a single
// "main image" picker, or leave at the default 3 for a variant's image gallery.
const ImageUploader = ({ images = [], onChange, max = 3, label }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const filledImages = images.filter(Boolean);
  const remainingSlots = max - filledImages.length;

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).slice(0, remainingSlots);
    if (files.length === 0) return;

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const { data } = await api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onChange([...filledImages, ...data.urls].slice(0, max));
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    onChange(filledImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {filledImages.map((url, index) => (
          <div key={url + index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-ink-200 group">
            <img src={url} alt={`${label || 'Image'} ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink-900/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}

        {remainingSlots > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-ink-300 flex flex-col items-center justify-center gap-1 text-ink-400 hover:border-brand-400 hover:text-brand-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="w-4 h-4 border-2 border-ink-300 border-t-brand-500 rounded-full animate-spin" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="text-[10px] font-medium">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={max > 1}
        hidden
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <p className="text-[11px] text-ink-400 mt-1.5">
        {max === 1 ? 'One image, 5MB max.' : `Up to ${max} images, 5MB each.`} {filledImages.length}/{max} added.
      </p>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploader;
