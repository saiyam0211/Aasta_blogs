/**
 * Script to convert PPTX slides to images
 * 
 * Note: This script requires one of the following:
 * 1. LibreOffice installed on the system (for libreoffice-convert)
 * 2. Or use PowerPoint/Google Slides to manually export slides as images
 * 
 * Manual conversion steps:
 * 1. Open pitchdeck.pptx in PowerPoint
 * 2. Go to File > Save As
 * 3. Choose PNG or JPEG format
 * 4. Select "All Slides" when prompted
 * 5. Save to public/pitch-deck/ folder
 * 6. Rename files to slide-1.png, slide-2.png, etc.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const pptxPath = path.join(projectRoot, 'public', 'pitchdeck.pptx');
const outputDir = path.join(projectRoot, 'public', 'pitch-deck');

async function convertPptxToImages() {
  try {
    // Check if PPTX file exists
    try {
      await fs.access(pptxPath);
      console.log('✓ Found pitchdeck.pptx');
    } catch (error) {
      console.error('✗ pitchdeck.pptx not found at:', pptxPath);
      console.log('\nPlease ensure pitchdeck.pptx is in the public/ folder');
      process.exit(1);
    }

    // Create output directory if it doesn't exist
    try {
      await fs.mkdir(outputDir, { recursive: true });
      console.log('✓ Created output directory:', outputDir);
    } catch (error) {
      console.error('✗ Error creating output directory:', error.message);
      process.exit(1);
    }

    console.log('\n⚠️  Automatic PPTX to image conversion requires additional setup.');
    console.log('\n📋 Manual Conversion Steps:');
    console.log('1. Open pitchdeck.pptx in PowerPoint or Google Slides');
    console.log('2. Go to File > Save As (or Export)');
    console.log('3. Choose PNG or JPEG format');
    console.log('4. Select "All Slides" when prompted');
    console.log('5. Save to:', outputDir);
    console.log('6. Rename files to: slide-1.png, slide-2.png, etc.');
    console.log('\n💡 Alternative: Use online converters like:');
    console.log('   - https://www.slidespilot.com/ppt-to-png');
    console.log('   - https://products.conholdate.app/conversion/powerpoint-to-image');
    console.log('\n✅ Once images are in place, the pitch deck section will work automatically!');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

convertPptxToImages();

