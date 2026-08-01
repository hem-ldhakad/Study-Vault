const User = require('../models/User');
const Note = require('../models/Note');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Toggle Bookmark Note for logged-in user
// @route   POST /api/users/bookmarks/:noteId
// @access  Private
const toggleBookmark = asyncHandler(async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);
  if (!note) {
    return next(new AppError('Note not found', 404));
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const isBookmarked = user.bookmarks.includes(noteId);

  if (isBookmarked) {
    // Remove from bookmarks
    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== noteId.toString()
    );
  } else {
    // Add to bookmarks
    user.bookmarks.push(noteId);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: isBookmarked ? 'Note removed from bookmarks' : 'Note added to bookmarks',
    isBookmarked: !isBookmarked,
    bookmarks: user.bookmarks,
  });
});

// @desc    Get user's bookmarked notes
// @route   GET /api/users/bookmarks
// @access  Private
const getUserBookmarks = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).populate({
    path: 'bookmarks',
    populate: [
      { path: 'category', select: 'name' },
      { path: 'subject', select: 'name' },
      { path: 'chapter', select: 'name' },
      { path: 'uploadedBy', select: 'name email' },
    ],
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: user.bookmarks.length,
    data: {
      bookmarks: user.bookmarks,
    },
  });
});

// @desc    Get all registered users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return next(new AppError('Invalid user role', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'User role updated successfully',
    data: { user },
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

module.exports = {
  toggleBookmark,
  getUserBookmarks,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
