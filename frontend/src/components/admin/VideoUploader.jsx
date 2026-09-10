import { useRef, useState } from 'react';

const MAX_SIZE_MB = 100;

// Uploads directly from the browser to Cloudinary's unsigned upload endpoint, bypassing our
// backend entirely — a video file would otherwise risk hitting the Vercel serverless function's
// request-size/timeout limits. Requires VITE_CLOUDINARY_CLOUD_NAME and
// VITE_CLOUDINARY_UPLOAD_PRESET (an unsigned preset) to be configured.
const VideoUploader = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const configured = Boolean(cloudName && uploadPreset);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please choose a video file');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Video must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'famous-hardware/shop-media');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        onChange(data.secure_url);
      } else {
        setError('Upload failed. Check your Cloudinary upload preset.');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError('Upload failed. Please check your connection and try again.');
    };

    xhr.send(formData);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (!configured) {
    return (
      <div className="border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl p-4 text-xs text-amber-700">
        Video upload isn't configured yet. Set <code className="font-mono">VITE_CLOUDINARY_CLOUD_NAME</code> and{' '}
        <code className="font-mono">VITE_CLOUDINARY_UPLOAD_PRESET</code> in the frontend's environment variables.
      </div>
    );
  }

  return (
    <div>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-ink-200 max-w-xs">
          <video src={value} className="w-full aspect-video object-cover" controls />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-ink-900/70 text-white text-sm flex items-center justify-center hover:bg-ink-900"
            aria-label="Remove video"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-xs aspect-video rounded-xl border-2 border-dashed border-ink-300 flex flex-col items-center justify-center gap-2 text-ink-400 hover:border-brand-400 hover:text-brand-500 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <span className="w-6 h-6 border-2 border-ink-300 border-t-brand-500 rounded-full animate-spin" />
              <span className="text-xs font-medium">{progress}%</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7zM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
              </svg>
              <span className="text-xs font-medium">Upload video</span>
            </>
          )}
        </button>
      )}

      <input ref={inputRef} type="file" accept="video/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />

      <p className="text-[11px] text-ink-400 mt-1.5">Up to {MAX_SIZE_MB}MB.</p>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default VideoUploader;
