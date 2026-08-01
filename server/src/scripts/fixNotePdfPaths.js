const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

const Note = require('../models/Note');

const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const fixNotePdfPaths = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      'mongodb+srv://yt:MD1TFwxOoFnXFkRD@cluster0.plwim5z.mongodb.net/studyvault?retryWrites=true&w=majority';

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
    console.log('[MongoDB] Connected to fix note PDF paths');

    const notes = await Note.find({});
    console.log(`Found ${notes.length} notes in database`);

    const notesDir = path.join(__dirname, '../../uploads/notes');
    const availablePdfs = fs.readdirSync(notesDir).filter((f) => f.endsWith('.pdf'));

    console.log('Available PDFs on disk:', availablePdfs);

    for (const note of notes) {
      let targetPdf = null;
      const titleLower = (note.title || '').toLowerCase();
      const descLower = (note.description || '').toLowerCase();

      // Find matching real original PDF file on disk
      if (titleLower.includes('event') || descLower.includes('event')) {
        targetPdf = '/uploads/notes/js_dom_events_masterclass.pdf';
      } else if (titleLower.includes('dom') || descLower.includes('dom')) {
        targetPdf = '/uploads/notes/javascript_guide.pdf';
      } else if (titleLower.includes('css') || titleLower.includes('box')) {
        targetPdf = '/uploads/notes/02_CSS_Box_Model_Spacing_Typography-1785441734720-520427202.pdf';
      } else if (titleLower.includes('html')) {
        targetPdf = '/uploads/notes/html_guide.pdf';
      } else if (titleLower.includes('dsa') || titleLower.includes('structure') || titleLower.includes('algorithm')) {
        targetPdf = '/uploads/notes/dsa_guide.pdf';
      } else if (titleLower.includes('react')) {
        targetPdf = '/uploads/notes/react_guide.pdf';
      } else if (titleLower.includes('node') || titleLower.includes('express')) {
        targetPdf = '/uploads/notes/nodejs_guide.pdf';
      } else if (titleLower.includes('mongo')) {
        targetPdf = '/uploads/notes/mongodb_guide.pdf';
      } else if (titleLower.includes('sql') || titleLower.includes('mysql')) {
        targetPdf = '/uploads/notes/mysql_guide.pdf';
      } else if (titleLower.includes('git')) {
        targetPdf = '/uploads/notes/git_guide.pdf';
      } else if (titleLower.includes('docker')) {
        targetPdf = '/uploads/notes/docker_guide.pdf';
      } else if (titleLower.includes('python')) {
        targetPdf = '/uploads/notes/python_guide.pdf';
      } else if (titleLower.includes('tailwind')) {
        targetPdf = '/uploads/notes/tailwind_guide.pdf';
      } else if (titleLower.includes('vite')) {
        targetPdf = '/uploads/notes/vite_guide.pdf';
      } else if (titleLower.includes('next')) {
        targetPdf = '/uploads/notes/nextjs_guide.pdf';
      } else {
        targetPdf = `/uploads/notes/${availablePdfs[0]}`;
      }

      note.pdf = targetPdf;
      await note.save();
      console.log(`Updated note "${note.title}" -> pdf: ${targetPdf}`);
    }

    console.log('✅ Successfully updated all note PDF paths in MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating note PDF paths:', err.message);
    process.exit(1);
  }
};

fixNotePdfPaths();
