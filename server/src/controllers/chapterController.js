const Chapter = require('../models/Chapter');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get chapters (optionally filtered by subject)
// @route   GET /api/chapters
// @access  Public
const getChapters = asyncHandler(async (req, res, next) => {
  const filter = {};
  if (req.query.subject) {
    filter.subject = req.query.subject;
  }

  const chapters = await Chapter.find(filter)
    .populate({
      path: 'subject',
      select: 'name category',
      populate: { path: 'category', select: 'name' },
    })
    .sort({ name: 1 });

  res.status(200).json({
    status: 'success',
    results: chapters.length,
    data: { chapters },
  });
});

// @desc    Create chapter
// @route   POST /api/chapters
// @access  Private/Admin
const createChapter = asyncHandler(async (req, res, next) => {
  const { name, subject } = req.body;
  if (!name || !subject) {
    return next(new AppError('Chapter name and subject ID are required', 400));
  }

  const chapter = await Chapter.create({
    name: name.trim(),
    subject,
  });

  res.status(201).json({
    status: 'success',
    message: 'Chapter created successfully',
    data: { chapter },
  });
});

// @desc    Update chapter
// @route   PUT /api/chapters/:id
// @access  Private/Admin
const updateChapter = asyncHandler(async (req, res, next) => {
  const { name, subject } = req.body;
  const updateData = {};
  if (name) updateData.name = name.trim();
  if (subject) updateData.subject = subject;

  const chapter = await Chapter.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('subject', 'name');

  if (!chapter) {
    return next(new AppError('Chapter not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Chapter updated successfully',
    data: { chapter },
  });
});

// @desc    Delete chapter
// @route   DELETE /api/chapters/:id
// @access  Private/Admin
const deleteChapter = asyncHandler(async (req, res, next) => {
  const chapter = await Chapter.findByIdAndDelete(req.params.id);
  if (!chapter) {
    return next(new AppError('Chapter not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Chapter deleted successfully',
  });
});

module.exports = {
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter,
};
