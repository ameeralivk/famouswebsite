import Category from '../models/Category.js';

// GET /api/categories
export const getCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};

// POST /api/categories (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const category = await Category.create({ name, description, image });
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
};

// PUT /api/categories/:id (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ category });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id (Admin) - soft delete
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deactivated', category });
  } catch (err) {
    next(err);
  }
};
