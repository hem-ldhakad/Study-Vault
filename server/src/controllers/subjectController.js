const Subject = require('../models/Subject');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get subjects (optionally filtered by category)
// @route   GET /api/subjects
// @access  Public
const getSubjects = asyncHandler(async (req, res, next) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const subjects = await Subject.find(filter)
    .populate('category', 'name')
    .sort({ name: 1 });

  res.status(200).json({
    status: 'success',
    results: subjects.length,
    data: { subjects },
  });
});

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  if (!name || !category) {
    return next(new AppError('Subject name and category ID are required', 400));
  }

  const subject = await Subject.create({
    name: name.trim(),
    category,
  });

  res.status(201).json({
    status: 'success',
    message: 'Subject created successfully',
    data: { subject },
  });
});

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const updateData = {};
  if (name) updateData.name = name.trim();
  if (category) updateData.category = category;

  const subject = await Subject.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('category', 'name');

  if (!subject) {
    return next(new AppError('Subject not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Subject updated successfully',
    data: { subject },
  });
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) {
    return next(new AppError('Subject not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Subject deleted successfully',
  });
});

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};
