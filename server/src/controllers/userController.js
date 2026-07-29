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

module.exports = {
  toggleBookmark,
  getUserBookmarks,
};
