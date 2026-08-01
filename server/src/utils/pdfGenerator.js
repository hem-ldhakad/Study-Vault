const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');

/**
 * Find the best matching real PDF file on disk in server/uploads/notes
 */
const findMatchingRealPDF = (filename = '', note = null) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    const notesDir = path.join(uploadsDir, 'notes');

    if (filename) {
      const cleanName = path.basename(filename);
      // 1. Direct exact match in uploads/notes/
      const directNotesPath = path.join(notesDir, cleanName);
      if (fs.existsSync(directNotesPath) && fs.statSync(directNotesPath).isFile()) {
        return directNotesPath;
      }
      // 2. Direct exact match in uploads/
      const directUploadsPath = path.join(uploadsDir, cleanName);
      if (fs.existsSync(directUploadsPath) && fs.statSync(directUploadsPath).isFile()) {
        return directUploadsPath;
      }
    }

    if (!fs.existsSync(notesDir)) return null;
    const availableFiles = fs.readdirSync(notesDir).filter((f) => f.endsWith('.pdf'));
    if (availableFiles.length === 0) return null;

    // Search query constructed from filename and note details
    const searchTerms = [
      filename.toLowerCase(),
      (note?.title || '').toLowerCase(),
      (note?.description || '').toLowerCase(),
      (note?.subject?.name || '').toLowerCase(),
      (note?.category?.name || '').toLowerCase(),
    ].join(' ');

    let bestFile = null;
    let maxScore = 0;

    for (const file of availableFiles) {
      const fileLower = file.toLowerCase();
      let score = 0;

      // Keyword matching against available study guide PDFs
      if ((searchTerms.includes('dom') || searchTerms.includes('event')) && (fileLower.includes('dom') || fileLower.includes('event') || fileLower.includes('js'))) score += 15;
      if (searchTerms.includes('css') && fileLower.includes('css')) score += 15;
      if (searchTerms.includes('html') && fileLower.includes('html')) score += 15;
      if (searchTerms.includes('react') && fileLower.includes('react')) score += 15;
      if (searchTerms.includes('node') && fileLower.includes('node')) score += 15;
      if (searchTerms.includes('mongo') && fileLower.includes('mongo')) score += 15;
      if (searchTerms.includes('mysql') && fileLower.includes('mysql')) score += 15;
      if (searchTerms.includes('git') && fileLower.includes('git')) score += 15;
      if (searchTerms.includes('dsa') && fileLower.includes('dsa')) score += 15;
      if (searchTerms.includes('docker') && fileLower.includes('docker')) score += 15;
      if (searchTerms.includes('vite') && fileLower.includes('vite')) score += 15;
      if (searchTerms.includes('next') && fileLower.includes('next')) score += 15;
      if (searchTerms.includes('python') && fileLower.includes('python')) score += 15;
      if (searchTerms.includes('js') || searchTerms.includes('javascript')) {
        if (fileLower.includes('js') || fileLower.includes('javascript')) score += 10;
      }

      const fileBase = fileLower.replace(/\.pdf$/, '');
      const parts = fileBase.split(/[^a-z0-9]/);
      for (const part of parts) {
        if (part.length > 2 && searchTerms.includes(part)) {
          score += 3;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestFile = file;
      }
    }

    if (bestFile) {
      return path.join(notesDir, bestFile);
    }

    // Default fallback to first available real PDF if any exist
    return path.join(notesDir, availableFiles[0]);
  } catch (err) {
    console.error('Error finding matching real PDF:', err.message);
    return null;
  }
};

/**
 * Generate a clean, 100% valid PDF Buffer on the fly for any note
 */
const generateDynamicPDF = (title = 'Academic Study Note', category = 'Study Guide', description = '') => {
  const safeTitle = (title || 'Academic Study Note').replace(/[^\w\s-]/gi, '').trim();
  const safeCategory = (category || 'Study Guide').replace(/[^\w\s-]/gi, '').trim();
  const cleanDesc = (description || 'Official academic notes document provided by StudyVault.').replace(/[^\w\s-.,]/gi, '').trim();
  const safeDesc = cleanDesc.length > 120 ? cleanDesc.substring(0, 117) + '...' : cleanDesc;

  const streamText = `BT
/F1 22 Tf
50 720 Td
(${safeTitle.substring(0, 45)}) Tj
/F1 12 Tf
0 -30 Td
(Category: ${safeCategory}) Tj
0 -20 Td
(Generated: ${new Date().toLocaleDateString('en-US')}) Tj
0 -40 Td
/F1 14 Tf
(Overview & Study Content:) Tj
0 -25 Td
/F1 11 Tf
(${safeDesc.substring(0, 90)}) Tj
0 -40 Td
/F1 12 Tf
(StudyVault Academic Sharing Platform - Document Reader) Tj
ET`;

  const streamLength = Buffer.byteLength(streamText, 'utf-8');

  const header = `%PDF-1.4\n`;
  const obj1 = `1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n`;
  const obj2 = `2 0 obj\n<</Type /Pages /Count 1 /Kids [3 0 R]>>\nendobj\n`;
  const obj3 = `3 0 obj\n<</Type /Page /Parent 2 0 R /Resources <</Font <</F1 4 0 R>>>> /MediaBox [0 0 612 792] /Contents 5 0 R>>\nendobj\n`;
  const obj4 = `4 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>\nendobj\n`;
  const obj5 = `5 0 obj\n<</Length ${streamLength}>>\nstream\n${streamText}\nendstream\nendobj\n`;

  const o1 = header.length;
  const o2 = o1 + obj1.length;
  const o3 = o2 + obj2.length;
  const o4 = o3 + obj3.length;
  const o5 = o4 + obj4.length;
  const xrefStart = o5 + obj5.length;

  const pad = (n) => String(n).padStart(10, '0');

  const xref = `xref\n0 6\n0000000000 65535 f \n${pad(o1)} 00000 n \n${pad(o2)} 00000 n \n${pad(o3)} 00000 n \n${pad(o4)} 00000 n \n${pad(o5)} 00000 n \n`;
  const trailer = `trailer\n<</Size 6 /Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;

  const fullPdf = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;
  return Buffer.from(fullPdf, 'utf-8');
};

/**
 * Express middleware helper to serve real PDF or auto-generate fallback PDF
 */
const serveOrGeneratePDF = async (req, res, filename, note = null) => {
  // 1. Prioritize serving actual real PDF file from disk
  const realPdfPath = findMatchingRealPDF(filename, note);
  if (realPdfPath && fs.existsSync(realPdfPath) && fs.statSync(realPdfPath).isFile()) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    return res.sendFile(realPdfPath);
  }

  // 2. Dynamic PDF generation fallback if no real PDF files exist on disk
  let noteTitle = note?.title;
  let categoryName = note?.category?.name || note?.category;
  let noteDesc = note?.description;

  if (!noteTitle && filename) {
    try {
      const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const foundNote = await Note.findOne({ pdf: new RegExp(escapedFilename, 'i') })
        .populate('category', 'name')
        .maxTimeMS(2000);
      if (foundNote) {
        noteTitle = foundNote.title;
        categoryName = foundNote.category?.name || 'Academic Note';
        noteDesc = foundNote.description;
      }
    } catch (err) {
      console.error('Error matching note for pdf generation:', err.message);
    }
  }

  if (!noteTitle && filename) {
    noteTitle = filename
      .replace(/-\d{10,}-\d+/g, '')
      .replace(/\.pdf$/i, '')
      .replace(/_/g, ' ');
  }

  const pdfBuffer = generateDynamicPDF(noteTitle, categoryName, noteDesc);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', pdfBuffer.length);
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  return res.send(pdfBuffer);
};

module.exports = {
  findMatchingRealPDF,
  generateDynamicPDF,
  serveOrGeneratePDF,
};
