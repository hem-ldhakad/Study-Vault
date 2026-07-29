const express = require('express');
const router = express.Router();
const {
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter,
} = require('../controllers/chapterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getChapters)
  .post(protect, authorize('admin'), createChapter);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateChapter)
  .delete(protect, authorize('admin'), deleteChapter);

module.exports = router;
