const express = require('express');
const router = express.Router();
const {
  getNotes,
  getRecentNotes,
  getPopularNotes,
  getNoteById,
  downloadNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Define multi-file upload middleware for PDF & Thumbnail
const noteUpload = upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// Public Listing & Analytics Routes
router.get('/', getNotes);
router.get('/recent', getRecentNotes);
router.get('/popular', getPopularNotes);
router.get('/:id', getNoteById);
router.get('/:id/download', downloadNote);

// Admin Protected Modification Routes
router.post('/', protect, authorize('admin'), noteUpload, createNote);
router.put('/:id', protect, authorize('admin'), noteUpload, updateNote);
router.delete('/:id', protect, authorize('admin'), deleteNote);

module.exports = router;
