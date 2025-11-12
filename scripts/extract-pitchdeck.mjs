import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const zipPath = path.join(projectRoot, 'public', 'pitchdeck.zip');
const outputDir = path.join(projectRoot, 'public', 'pitch-deck');

async function extractPitchDeck() {
  try {
    // Check if zip file exists
    if (!fs.existsSync(zipPath)) {
      console.log('⚠️  pitchdeck.zip not found, skipping extraction');
      return;
    }

    console.log('📦 Extracting pitchdeck.zip...');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('✓ Created output directory:', outputDir);
    }

    // Extract zip file
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();

    // Filter for JPG images and sort them
    const imageEntries = zipEntries
      .filter(entry => {
        const ext = path.extname(entry.entryName).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg';
      })
      .sort((a, b) => {
        // Sort by filename to ensure correct order
        return a.entryName.localeCompare(b.entryName);
      });

    if (imageEntries.length === 0) {
      console.log('⚠️  No JPG images found in zip file');
      return;
    }

    console.log(`✓ Found ${imageEntries.length} slide images`);

    // Extract and rename images
    imageEntries.forEach((entry, index) => {
      const imageData = entry.getData();
      const slideNumber = index + 1;
      const outputPath = path.join(outputDir, `slide-${slideNumber}.jpg`);
      
      fs.writeFileSync(outputPath, imageData);
      console.log(`✓ Extracted: slide-${slideNumber}.jpg`);
    });

    // Delete the zip file
    fs.unlinkSync(zipPath);
    console.log('✓ Deleted pitchdeck.zip');

    console.log('✅ Pitch deck extraction complete!');
  } catch (error) {
    console.error('❌ Error extracting pitch deck:', error.message);
    // Don't fail the build if extraction fails
    process.exit(0);
  }
}

extractPitchDeck();

