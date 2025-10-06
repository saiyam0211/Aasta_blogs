import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const images = [
  'public/hero_mascot.png',
  'public/footer_mascot.png',
  'public/blogs_mascot.png',
  'public/blog_1.png'
];

async function convertOne(inputPath) {
  const dir = path.dirname(inputPath);
  const base = path.basename(inputPath, path.extname(inputPath));
  const src = path.resolve(inputPath);
  if (!fs.existsSync(src)) return;

  const avifPath = path.resolve(dir, `${base}.avif`);
  const webpPath = path.resolve(dir, `${base}.webp`);

  try {
    await sharp(src).avif({ quality: 60 }).toFile(avifPath);
  } catch {}
  try {
    await sharp(src).webp({ quality: 70 }).toFile(webpPath);
  } catch {}
}

async function main() {
  await Promise.all(images.map(convertOne));
}

main().catch(() => process.exit(0));


