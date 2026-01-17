import { cpSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = 'src/content/docs';
const DEST_DIR = 'public/docs';
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif'];

function copyImages(srcDir, destDir) {
  if (!existsSync(srcDir)) return;
  
  const entries = readdirSync(srcDir);
  
  for (const entry of entries) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    const stat = statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyImages(srcPath, destPath);
    } else if (IMAGE_EXTENSIONS.includes(extname(entry).toLowerCase())) {
      mkdirSync(destDir, { recursive: true });
      cpSync(srcPath, destPath);
    }
  }
}

mkdirSync(DEST_DIR, { recursive: true });
copyImages(SRC_DIR, DEST_DIR);
console.log('Images copied successfully');
