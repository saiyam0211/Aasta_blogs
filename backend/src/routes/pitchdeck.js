const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

// Serve PPTX file info
router.get('/info', async (req, res) => {
  try {
    const pptxPath = path.join(__dirname, '../../public/pitchdeck.pptx');
    
    // Check if file exists
    try {
      await fs.access(pptxPath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'Pitch deck file not found'
      });
    }

    // For now, return basic info
    // In production, you would parse PPTX and return slide count
    res.json({
      success: true,
      message: 'Pitch deck file found',
      filePath: '/pitchdeck.pptx',
      // Note: To get actual slide count, you'd need to parse the PPTX file
      // This requires a library like 'pptxjs' or similar
    });
  } catch (error) {
    console.error('Error serving pitch deck info:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving pitch deck info',
      error: error.message
    });
  }
});

module.exports = router;

