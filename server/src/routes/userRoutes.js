const express = require('express');
const router = express.Router();
const {
  toggleBookmark,
  getUserBookmarks,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/bookmarks', getUserBookmarks);
router.post('/bookmarks/:noteId', toggleBookmark);

module.exports = router;
