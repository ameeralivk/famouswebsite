import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'famous-hardware/products', resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// POST /api/upload/images (Admin) - accepts up to 3 images under the "images" field
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image file is required' });
    }

    const results = await Promise.all(req.files.map((file) => streamUpload(file.buffer)));
    const urls = results.map((r) => r.secure_url);

    res.status(201).json({ urls });
  } catch (err) {
    next(err);
  }
};
