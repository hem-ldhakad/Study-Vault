const Category = require('../models/Category');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(new AppError('Category name is required', 400));
  }

  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    return next(new AppError('Category already exists', 400));
  }

  const category = await Category.create({ name: name.trim() });
  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    data: { category },
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(new AppError('Category name is required', 400));
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: name.trim() },
    { new: true, runValidators: true }
  );

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
    data: { category },
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully',
  });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
