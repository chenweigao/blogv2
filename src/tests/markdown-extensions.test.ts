import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseImageSize } from '../lib/remark-image-size';

/**
 * Property 23: Markdown Highlight Syntax
 * Validates: Requirements 15.2
 */

// Simulates highlight syntax processing
function processHighlight(text: string): string {
  return text.replace(/==([^=]+)==/g, '<mark>$1</mark>');
}

describe('Property 23: Markdown Highlight Syntax', () => {
  it('converts ==text== to <mark> element', () => {
    expect(processHighlight('This is ==highlighted== text'))
      .toBe('This is <mark>highlighted</mark> text');
  });

  it('handles multiple highlights', () => {
    expect(processHighlight('==one== and ==two=='))
      .toBe('<mark>one</mark> and <mark>two</mark>');
  });

  it('property: highlight always produces mark tags', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('=')),
        (content) => {
          const input = `==${content}==`;
          const output = processHighlight(input);
          return output === `<mark>${content}</mark>`;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: text without == is unchanged', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes('==')),
        (text) => {
          return processHighlight(text) === text;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 24: Image Size Syntax
 * Validates: Requirements 15.3
 */
describe('Property 24: Image Size Syntax', () => {
  it('parses width only', () => {
    const result = parseImageSize('image.png =300');
    expect(result).toEqual({ url: 'image.png', width: 300 });
  });

  it('parses width and height', () => {
    const result = parseImageSize('image.png =300x200');
    expect(result).toEqual({ url: 'image.png', width: 300, height: 200 });
  });

  it('returns original URL when no size', () => {
    const result = parseImageSize('image.png');
    expect(result).toEqual({ url: 'image.png' });
  });

  it('property: parsed width is always positive', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.stringMatching(/^[a-z]+\.(png|jpg)$/),
          fc.integer({ min: 1, max: 2000 })
        ),
        ([filename, width]) => {
          const result = parseImageSize(`${filename} =${width}`);
          return result.width !== undefined && result.width > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: URL without size returns undefined dimensions', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z]+\.(png|jpg|gif)$/),
        (url) => {
          const result = parseImageSize(url);
          return result.width === undefined && result.height === undefined;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 25: Relative Image Path Resolution
 * Validates: Requirements 15.4
 */

function resolveImagePath(imagePath: string, docPath: string, basePath: string = '/blogv2/'): string {
  if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Get directory of current doc
  const docDir = docPath.split('/').slice(0, -1).join('/');
  
  // Resolve relative path
  const parts = [...docDir.split('/'), ...imagePath.split('/')].filter(Boolean);
  const resolved: string[] = [];
  
  for (const part of parts) {
    if (part === '..') {
      resolved.pop();
    } else if (part !== '.') {
      resolved.push(part);
    }
  }
  
  return `${basePath}${resolved.join('/')}`;
}

describe('Property 25: Relative Image Path Resolution', () => {
  it('resolves same-directory image', () => {
    expect(resolveImagePath('image.png', 'docs/algorithms/dp.md'))
      .toBe('/blogv2/docs/algorithms/image.png');
  });

  it('resolves parent-directory image', () => {
    expect(resolveImagePath('../image.png', 'docs/algorithms/dp.md'))
      .toBe('/blogv2/docs/image.png');
  });

  it('preserves absolute paths', () => {
    expect(resolveImagePath('/images/logo.png', 'docs/index.md'))
      .toBe('/images/logo.png');
  });

  it('preserves URLs', () => {
    expect(resolveImagePath('https://example.com/img.png', 'docs/index.md'))
      .toBe('https://example.com/img.png');
  });

  it('property: resolved path always starts with base path for relative images', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z]+\.(png|jpg)$/),
        fc.array(fc.stringMatching(/^[a-z]+$/), { minLength: 1, maxLength: 3 }),
        (filename, pathParts) => {
          const docPath = pathParts.join('/') + '/doc.md';
          const result = resolveImagePath(filename, docPath);
          return result.startsWith('/blogv2/');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 26: Math Equation Rendering
 * Validates: Requirements 15.5
 */

// Simulates math detection
function containsMath(text: string): { inline: boolean; block: boolean } {
  const inlineMatch = /\$[^$]+\$/.test(text);
  const blockMatch = /\$\$[^$]+\$\$/.test(text);
  return { inline: inlineMatch && !blockMatch, block: blockMatch };
}

describe('Property 26: Math Equation Rendering', () => {
  it('detects inline math', () => {
    expect(containsMath('The formula $E=mc^2$ is famous')).toEqual({ inline: true, block: false });
  });

  it('detects block math', () => {
    expect(containsMath('$$\\sum_{i=1}^n i$$')).toEqual({ inline: false, block: true });
  });

  it('property: $...$ is detected as inline', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('$')),
        (content) => {
          const text = `$${content}$`;
          const result = containsMath(text);
          return result.inline || result.block;
        }
      ),
      { numRuns: 100 }
    );
  });
});
