import ShopMedia from '../models/ShopMedia.js';

// GET /api/shop-media (public) - used by the homepage gallery
export const getShopMedia = async (_req, res, next) => {
  try {
    const media = await ShopMedia.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ media });
  } catch (err) {
    next(err);
  }
};

// POST /api/shop-media (Admin)
// Photos are uploaded via /api/upload/images first; videos are uploaded directly from the
// browser to Cloudinary (see frontend VideoUploader) to avoid the serverless function's
// request-size/timeout limits. Either way, only the resulting URL is stored here.
export const createShopMedia = async (req, res, next) => {
  try {
    const { url, type, caption, order } = req.body;
    if (!url || !type) {
      return res.status(400).json({ message: 'url and type are required' });
    }
    if (!['image', 'video'].includes(type)) {
      return res.status(400).json({ message: 'type must be "image" or "video"' });
    }

    const media = await ShopMedia.create({ url, type, caption, order: order || 0 });
    res.status(201).json({ media });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/shop-media/:id (Admin)
export const deleteShopMedia = async (req, res, next) => {
  try {
    const media = await ShopMedia.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });
    res.status(200).json({ message: 'Media removed' });
  } catch (err) {
    next(err);
  }
};
