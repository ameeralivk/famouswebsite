import Category from '../models/Category.js';

// GET /api/categories
// Defaults to a generous limit so existing unpaginated callers (e.g. the storefront's category
// nav) keep getting the full list; pass page/limit explicitly (as the admin panel does) to page.
export const getCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const filter = { isActive: true };
    const [categories, total] = await Promise.all([
      Category.find(filter)
        .sort('name')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Category.countDocuments(filter)
    ]);

    res.status(200).json({
      categories,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum }
    });
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
