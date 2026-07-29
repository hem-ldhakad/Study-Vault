const Note = require('../models/Note');
const User = require('../models/User');
const Category = require('../models/Category');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get Admin Dashboard Analytics & Statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalNotes = await Note.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalCategories = await Category.countDocuments();
  const totalSubjects = await Subject.countDocuments();
  const totalChapters = await Chapter.countDocuments();

  // Aggregate total downloads and total views
  const statsAggregation = await Note.aggregate([
    {
      $group: {
        _id: null,
        totalDownloads: { $sum: '$downloads' },
        totalViews: { $sum: '$views' },
      },
    },
  ]);

  const totalDownloads = statsAggregation[0]?.totalDownloads || 0;
  const totalViews = statsAggregation[0]?.totalViews || 0;

  // Recent 5 uploaded notes
  const recentNotes = await Note.find()
    .populate('category', 'name')
    .populate('subject', 'name')
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    status: 'success',
    data: {
      totalNotes,
      totalUsers,
      totalCategories,
      totalSubjects,
      totalChapters,
      totalDownloads,
      totalViews,
      recentNotes,
    },
  });
});

module.exports = {
  getDashboardStats,
};
