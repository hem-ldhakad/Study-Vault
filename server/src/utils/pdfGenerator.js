const Note = require('../models/Note');

/**
 * Generate a clean dynamic PDF Buffer on the fly for any note
 */
const generateDynamicPDF = (title = 'Academic Study Note', category = 'Study Guide', description = '') => {
  const safeTitle = (title || 'Academic Study Note').replace(/[^\w\s-]/gi, '').trim();
  const safeCategory = (category || 'Study Guide').replace(/[^\w\s-]/gi, '').trim();
  const cleanDesc = (description || 'Official academic notes document provided by StudyVault.').replace(/[^\w\s-.,]/gi, '').trim();
  const safeDesc = cleanDesc.length > 120 ? cleanDesc.substring(0, 117) + '...' : cleanDesc;

  const pdfContent = `%PDF-1.4
1 0 obj
<</Type /Catalog /Pages 2 0 R>>
endobj
2 0 obj
<</Type /Pages /Count 1 /Kids [3 0 R]>>
endobj
3 0 obj
<</Type /Page /Parent 2 0 R /Resources <</Font <</F1 4 0 R>>>> /MediaBox [0 0 612 792] /Contents 5 0 R>>
endobj
4 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
endobj
5 0 obj
<</Length 400>>
stream
BT
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
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000315 00000 n 
trailer
<</Size 6 /Root 1 0 R>>
startxref
760
%%EOF`;

  return Buffer.from(pdfContent, 'utf-8');
};

/**
 * Express middleware helper to serve or auto-generate PDF
 */
const serveOrGeneratePDF = async (req, res, filename, note = null) => {
  let noteTitle = note?.title;
  let categoryName = note?.category?.name || note?.category;
  let noteDesc = note?.description;

  if (!noteTitle && filename) {
    // Try finding note in database by pdf path matching filename
    try {
      const foundNote = await Note.findOne({ pdf: new RegExp(filename, 'i') }).populate('category', 'name');
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
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  return res.send(pdfBuffer);
};

module.exports = {
  generateDynamicPDF,
  serveOrGeneratePDF,
};
