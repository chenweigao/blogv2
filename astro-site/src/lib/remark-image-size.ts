/**
 * Remark plugin for image size syntax: ![alt](url =WxH)
 * Validates: Requirements 15.3
 */

import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';

export function remarkImageSize() {
  return (tree: Root) => {
    visit(tree, 'image', (node: Image) => {
      // Check for size syntax in URL: url =WxH or url =W
      const match = node.url.match(/^(.+?)\s*=(\d+)(?:x(\d+))?$/);
      
      if (match) {
        const [, url, width, height] = match;
        node.url = url;
        
        // Store dimensions in data for later processing
        (node as any).data = {
          ...(node as any).data,
          hProperties: {
            width: parseInt(width, 10),
            ...(height && { height: parseInt(height, 10) }),
          },
        };
      }
    });
  };
}

/**
 * Parse image size from URL
 * Returns { url, width?, height? }
 */
export function parseImageSize(urlWithSize: string): { url: string; width?: number; height?: number } {
  const match = urlWithSize.match(/^(.+?)\s*=(\d+)(?:x(\d+))?$/);
  
  if (!match) {
    return { url: urlWithSize };
  }

  const [, url, width, height] = match;
  return {
    url,
    width: parseInt(width, 10),
    ...(height && { height: parseInt(height, 10) }),
  };
}
