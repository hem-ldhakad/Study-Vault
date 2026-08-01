const Note = require('../models/Note');

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
 * Express middleware helper to serve or auto-generate PDF
 */
const serveOrGeneratePDF = async (req, res, filename, note = null) => {
  let noteTitle = note?.title;
  let categoryName = note?.category?.name || note?.category;
  let noteDesc = note?.description;

  if (!noteTitle && filename) {
    // Try finding note in database by pdf path matching filename with safely escaped regex
    try {
      const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const foundNote = await Note.findOne({ pdf: new RegExp(escapedFilename, 'i') }).populate('category', 'name');
      if (foundNote) {
        noteTitle = foundNote.title;
        categoryName = foundNote.category?.name || 'Academic Note';
        noteDesc = foundNote.description;
      }
    } catch (err) {
      console.error('Error matching note for pdf generation:', err);
    }
  }

  if (!noteTitle && filename) {
    // Format human-readable title from filename
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
  generateDynamicPDF,
  serveOrGeneratePDF,
};
