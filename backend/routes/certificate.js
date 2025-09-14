const express = require('express');
const PDFDocument = require('pdfkit');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate and download certificate
router.get('/certificate/:resultId', authenticateToken, async (req, res) => {
  try {
    const resultId = req.params.resultId;
    const userId = req.user.id;

    // Get result details with user and quiz information
    const [results] = await pool.execute(
      `SELECT r.*, q.title as quiz_title, u.name as user_name, u.email as user_email
       FROM results r
       JOIN quizzes q ON r.quiz_id = q.id
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ? AND r.user_id = ?`,
      [resultId, userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }

    const result = results[0];

    // Only generate certificate for passed results
    if (!result.passed) {
      return res.status(400).json({ error: 'Certificate can only be generated for passed quizzes' });
    }

    // Create PDF document
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${result.quiz_title.replace(/\s+/g, '-')}-${result.user_name.replace(/\s+/g, '-')}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Certificate design
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Background border
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
       .stroke('#2c3e50')
       .lineWidth(3);

    doc.rect(40, 40, pageWidth - 80, pageHeight - 80)
       .stroke('#3498db')
       .lineWidth(1);

    // Header
    doc.fontSize(36)
       .fillColor('#2c3e50')
       .font('Helvetica-Bold')
       .text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });

    // Decorative line
    doc.moveTo(200, 160)
       .lineTo(pageWidth - 200, 160)
       .stroke('#3498db')
       .lineWidth(2);

    // Main content
    doc.fontSize(18)
       .fillColor('#34495e')
       .font('Helvetica')
       .text('This is to certify that', 0, 200, { align: 'center' });

    doc.fontSize(32)
       .fillColor('#2c3e50')
       .font('Helvetica-Bold')
       .text(result.user_name, 0, 240, { align: 'center' });

    doc.fontSize(18)
       .fillColor('#34495e')
       .font('Helvetica')
       .text('has successfully completed the', 0, 300, { align: 'center' });

    doc.fontSize(24)
       .fillColor('#3498db')
       .font('Helvetica-Bold')
       .text(result.quiz_title, 0, 340, { align: 'center' });

    doc.fontSize(16)
       .fillColor('#34495e')
       .font('Helvetica')
       .text(`with a score of ${result.score}/${result.total_questions} (${result.percentage}%)`, 0, 390, { align: 'center' });

    // Date and signature area
    const completionDate = new Date(result.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.fontSize(14)
       .fillColor('#7f8c8d')
       .font('Helvetica')
       .text(`Completed on: ${completionDate}`, 0, 450, { align: 'center' });

    // Footer
    doc.fontSize(12)
       .fillColor('#95a5a6')
       .font('Helvetica')
       .text('LMS Micro-Certification Portal', 100, pageHeight - 100)
       .text('Authorized Digital Certificate', pageWidth - 250, pageHeight - 100);

    // Certificate ID
    doc.fontSize(10)
       .fillColor('#bdc3c7')
       .text(`Certificate ID: LMS-${resultId}-${Date.now()}`, 0, pageHeight - 60, { align: 'center' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
