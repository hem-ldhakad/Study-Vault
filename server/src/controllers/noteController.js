const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { serveOrGeneratePDF } = require('../utils/pdfGenerator');

// @desc    Get all notes (Browse with Search, Filter & Pagination)
// @route   GET /api/notes
// @access  Public
const getNotes = asyncHandler(async (req, res, next) => {
  const { search, category, subject, chapter, page = 1, limit = 10, sort = '-createdAt' } = req.query;

  const query = {};

  // Category, Subject, Chapter filters
  if (category) query.category = category;
  if (subject) query.subject = subject;
  if (chapter) query.chapter = chapter;

  // Search keyword in title, description, or tags
  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { tags: searchRegex },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const totalNotes = await Note.countDocuments(query);

  const notes = await Note.find(query)
    .populate('category', 'name')
    .populate('subject', 'name')
    .populate('chapter', 'name')
    .populate('uploadedBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    status: 'success',
    results: notes.length,
    total: totalNotes,
    page: pageNum,
    pages: Math.ceil(totalNotes / limitNum),
    data: { notes },
  });
});

// @desc    Get Recent Notes (Top 10 sorted by createdAt)
// @route   GET /api/notes/recent
// @access  Public
const getRecentNotes = asyncHandler(async (req, res, next) => {
  const recentNotes = await Note.find()
    .populate('category', 'name')
    .populate('subject', 'name')
    .populate('chapter', 'name')
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    status: 'success',
    results: recentNotes.length,
    data: { notes: recentNotes },
  });
});

// @desc    Get Popular Notes (Top 10 sorted by downloads and views)
// @route   GET /api/notes/popular
// @access  Public
const getPopularNotes = asyncHandler(async (req, res, next) => {
  const popularNotes = await Note.find()
    .populate('category', 'name')
    .populate('subject', 'name')
    .populate('chapter', 'name')
    .populate('uploadedBy', 'name email')
    .sort({ downloads: -1, views: -1 })
    .limit(10);

  res.status(200).json({
    status: 'success',
    results: popularNotes.length,
    data: { notes: popularNotes },
  });
});

// @desc    Get Single Note & Increment View Count
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = asyncHandler(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('category', 'name')
    .populate('subject', 'name')
    .populate('chapter', 'name')
    .populate('uploadedBy', 'name email');

  if (!note) {
    return next(new AppError('Note not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { note },
  });
});

// @desc    Download Note PDF & Increment Download Count
// @route   GET /api/notes/:id/download
// @desc    Download Note PDF Document
// @route   GET /api/notes/:id/download
// @access  Public
const downloadNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { $inc: { downloads: 1 } },
    { new: true }
  ).populate('category', 'name');

  if (!note) {
    return next(new AppError('Note not found', 404));
  }

  if (!note.pdf) {
    return next(new AppError('No PDF associated with this note', 404));
  }

  // Handle external HTTP/HTTPS URLs
  if (note.pdf.startsWith('http://') || note.pdf.startsWith('https://')) {
    return res.redirect(note.pdf);
  }

  const downloadFilename = `${(note.title || 'Note_Document').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  const fileName = path.basename(note.pdf);

  // Check exact file candidates on disk
  const relativePath = note.pdf.startsWith('/') ? note.pdf.substring(1) : note.pdf;
  const directPath = path.join(__dirname, '../../', relativePath);
  const candidateNotes = path.join(__dirname, '../../uploads/notes', fileName);
  const candidateUploads = path.join(__dirname, '../../uploads', fileName);
  const candidateCwdNotes = path.join(process.cwd(), 'server/uploads/notes', fileName);
  const candidateCwdRoot = path.join(process.cwd(), 'uploads/notes', fileName);

  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    return res.download(directPath, downloadFilename);
  }

  if (fs.existsSync(candidateNotes) && fs.statSync(candidateNotes).isFile()) {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    return res.download(candidateNotes, downloadFilename);
  }

  if (fs.existsSync(candidateUploads) && fs.statSync(candidateUploads).isFile()) {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    return res.download(candidateUploads, downloadFilename);
  }

  if (fs.existsSync(candidateCwdNotes) && fs.statSync(candidateCwdNotes).isFile()) {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    return res.download(candidateCwdNotes, downloadFilename);
  }

  if (fs.existsSync(candidateCwdRoot) && fs.statSync(candidateCwdRoot).isFile()) {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    return res.download(candidateCwdRoot, downloadFilename);
  }

  // Fallback: Generate and stream clean custom PDF for this note
  return await serveOrGeneratePDF(req, res, fileName, note);
});

// @desc    Create Note (Admin Upload PDF & Thumbnail)
// @route   POST /api/notes
// @access  Private/Admin
const createNote = asyncHandler(async (req, res, next) => {
  const { title, description, category, subject, chapter, tags } = req.body;

  if (!title || !category || !subject || !chapter) {
    return next(new AppError('Title, category, subject, and chapter are required fields', 400));
  }

  if (!req.files || !req.files.pdf || req.files.pdf.length === 0) {
    return next(new AppError('PDF file attachment is required', 400));
  }

  const pdfFile = req.files.pdf[0];
  const pdfUrl = `/uploads/notes/${pdfFile.filename}`;

  let thumbnailUrl = '';
  if (req.files.thumbnail && req.files.thumbnail.length > 0) {
    thumbnailUrl = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
  }

  // Parse tags
  let parsedTags = [];
  if (tags) {
    parsedTags = Array.isArray(tags)
      ? tags
      : tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
  }

  const note = await Note.create({
    title,
    description: description || '',
    category,
    subject,
    chapter,
    tags: parsedTags,
    thumbnail: thumbnailUrl,
    pdf: pdfUrl,
    uploadedBy: req.userId,
  });

  const populatedNote = await Note.findById(note._id)
    .populate('category', 'name')
    .populate('subject', 'name')
    .populate('chapter', 'name')
    .populate('uploadedBy', 'name email');

  res.status(201).json({
    status: 'success',
    message: 'Note created successfully',
    data: { note: populatedNote },
  });
});

// @desc    Update Note (Admin Edit Details & Files)
// @route   PUT /api/notes/:id
// @access  Private/Admin
const updateNote = asyncHandler(async (req, res, next) => {
  let note = await Note.findById(req.params.id);
  if (!note) {
    return next(new AppError('Note not found', 404));
  }

  const { title, description, category, subject, chapter, tags } = req.body;

  const updateFields = {};
  if (title) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (category) updateFields.category = category;
  if (subject) updateFields.subject = subject;
  if (chapter) updateFields.chapter = chapter;

  if (tags) {
    updateFields.tags = Array.isArray(tags)
      ? tags
      : tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
  }

  // File replacement logic
  if (req.files) {
    if (req.files.pdf && req.files.pdf.length > 0) {
      // Unlink old PDF file
      const oldPdfPath = path.join(__dirname, '../../', note.pdf.substring(1));
      if (fs.existsSync(oldPdfPath)) {
        fs.unlinkSync(oldPdfPath);
      }
      updateFields.pdf = `/uploads/${req.files.pdf[0].filename}`;
    }

    if (req.files.thumbnail && req.files.thumbnail.length > 0) {
      // Unlink old thumbnail file if exists
      if (note.thumbnail) {
        const oldThumbPath = path.join(__dirname, '../../', note.thumbnail.substring(1));
        if (fs.existsSync(oldThumbPath)) {
          fs.unlinkSync(oldThumbPath);
        }
      }
      updateFields.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    }
  }

  note = await Note.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  })
    .populate('category', 'name')
    .populate('subject', 'name')
    .populate('chapter', 'name')
    .populate('uploadedBy', 'name email');

  res.status(200).json({
    status: 'success',
    message: 'Note updated successfully',
    data: { note },
  });
});

// @desc    Delete Note & Remove Uploaded Files from Disk
// @route   DELETE /api/notes/:id
// @access  Private/Admin
const deleteNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return next(new AppError('Note not found', 404));
  }

  // Unlink PDF file from disk
  if (note.pdf) {
    const pdfPath = path.join(__dirname, '../../', note.pdf.startsWith('/') ? note.pdf.substring(1) : note.pdf);
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
  }

  // Unlink thumbnail file from disk
  if (note.thumbnail) {
    const thumbPath = path.join(__dirname, '../../', note.thumbnail.startsWith('/') ? note.thumbnail.substring(1) : note.thumbnail);
    if (fs.existsSync(thumbPath)) {
      fs.unlinkSync(thumbPath);
    }
  }

  await Note.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Note and associated files deleted successfully',
  });
});

module.exports = {
  getNotes,
  getRecentNotes,
  getPopularNotes,
  getNoteById,
  downloadNote,
  createNote,
  updateNote,
  deleteNote,
};
