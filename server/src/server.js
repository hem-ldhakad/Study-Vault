const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');

// Load environment variables (from server/.env or root .env)
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

// Connect to MongoDB Atlas / Database
connectDB();

const app = express();

// Security HTTP headers (allowing cross-origin iframe embedding for PDF viewer)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: false,
  })
);

// Flexible CORS Configuration for Development & Production
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or dev proxy)
    if (!origin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    if (origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const { serveOrGeneratePDF } = require('./utils/pdfGenerator');

// Static directory for uploaded files with automatic dynamic PDF generation fallback
app.use('/uploads', async (req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    const relPath = decodeURIComponent(req.path);
    const uploadsDir = path.join(__dirname, '../uploads');
    const primaryPath = path.join(uploadsDir, relPath);

    if (fs.existsSync(primaryPath) && fs.statSync(primaryPath).isFile()) {
      return res.sendFile(primaryPath);
    }

    // Fallback search in notes/ and thumbnails/
    const fileName = path.basename(relPath);
    const candidateNotes = path.join(uploadsDir, 'notes', fileName);
    const candidateThumbs = path.join(uploadsDir, 'thumbnails', fileName);

    if (fs.existsSync(candidateNotes) && fs.statSync(candidateNotes).isFile()) {
      return res.sendFile(candidateNotes);
    }

    if (fs.existsSync(candidateThumbs) && fs.statSync(candidateThumbs).isFile()) {
      return res.sendFile(candidateThumbs);
    }

    // If a PDF document is requested but not found anywhere on disk, automatically generate and stream it
    if (relPath.toLowerCase().endsWith('.pdf')) {
      const notesDir = path.join(uploadsDir, 'notes');
      if (fs.existsSync(notesDir)) {
        const pdfFiles = fs.readdirSync(notesDir).filter((f) => f.endsWith('.pdf'));
        if (pdfFiles.length > 0) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
          return res.sendFile(path.join(notesDir, pdfFiles[0]));
        }
      }

      return await serveOrGeneratePDF(req, res, fileName);
    }

    next();
  } catch (err) {
    next(err);
  }
});

// API Routes Mount Points
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'StudyVault Express Backend running smoothly',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'StudyVault Express Backend running smoothly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Handle unhandled routes (404 Not Found)
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global Central Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[StudyVault Backend] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections without crashing the server process in production
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err?.name || 'Error', err?.message || err);
});

module.exports = app;
