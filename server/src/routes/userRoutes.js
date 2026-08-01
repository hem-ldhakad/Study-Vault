const express = require('express');
const router = express.Router();
const {
  toggleBookmark,
  getUserBookmarks,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/bookmarks', getUserBookmarks);
router.post('/bookmarks/:noteId', toggleBookmark);

// Admin-only user management routes
router.get('/', restrictTo('admin'), getAllUsers);
router.put('/:id/role', restrictTo('admin'), updateUserRole);
router.delete('/:id', restrictTo('admin'), deleteUser);

module.exports = router;
