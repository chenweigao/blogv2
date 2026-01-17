/**
 * Remark plugin to transform relative image paths to absolute paths
 * This handles images in content collections that use relative paths
 * Images are served from /docs/... (copied from src/content/docs to public/docs)
 */

import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';
import path from 'path';

export function remarkRelativeImages() {
  return (tree: Root, file: any) => {
    // Get the file path from the VFile
    const filePath = file.history?.[0] || file.path || '';
    
    visit(tree, 'image', (node: Image) => {
      // Skip if already absolute or external URL
      if (node.url.startsWith('/') || node.url.startsWith('http://') || node.url.startsWith('https://') || node.url.startsWith('data:')) {
        return;
      }
      
      // Handle relative paths
      if (node.url.startsWith('./') || node.url.startsWith('../')) {
        // Get the directory of the current file relative to content/docs
        const contentDocsPath = 'src/content/docs';
        const fileDir = path.dirname(filePath);
        
        // Find the relative position within content/docs
        const contentIndex = fileDir.indexOf(contentDocsPath);
        if (contentIndex !== -1) {
          const relativeDir = fileDir.slice(contentIndex + contentDocsPath.length);
          
          // Resolve the image path relative to the markdown file
          const resolvedPath = path.join(relativeDir, node.url);
          const normalizedPath = path.normalize(resolvedPath).replace(/\\/g, '/');
          
          // Convert to absolute path for the public folder
          // Images are served from /docs/...
          node.url = `/docs${normalizedPath}`;
        }
      }
    });
  };
}
