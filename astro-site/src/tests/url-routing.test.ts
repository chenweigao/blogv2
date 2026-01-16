import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 2: Content URL Routing
 * Validates: Requirements 2.6
 * 
 * Tests that file paths generate correct URLs
 */

// Simulates the URL generation logic from [...slug].astro
function filePathToUrl(filePath: string, basePath: string = '/blogv2/'): string {
  // Remove .md extension and normalize
  const slug = filePath.replace(/\.md$/, '').replace(/\\/g, '/');
  return `${basePath}${slug}/`;
}

// Simulates extracting slug from file path
function filePathToSlug(filePath: string): string {
  return filePath.replace(/\.md$/, '').replace(/\\/g, '/');
}

describe('Property 2: Content URL Routing', () => {
  it('generates correct URL for simple file path', () => {
    expect(filePathToUrl('algorithms/dp.md')).toBe('/blogv2/algorithms/dp/');
    expect(filePathToUrl('index.md')).toBe('/blogv2/index/');
  });

  it('generates correct URL for nested paths', () => {
    expect(filePathToUrl('computer-systems/linux/kernel/README.md'))
      .toBe('/blogv2/computer-systems/linux/kernel/README/');
  });

  it('property: URL always starts with base path', () => {
    const filePathArb = fc.array(
      fc.stringMatching(/^[a-z0-9-]+$/),
      { minLength: 1, maxLength: 5 }
    ).map(parts => parts.join('/') + '.md');

    fc.assert(
      fc.property(filePathArb, (filePath) => {
        const url = filePathToUrl(filePath);
        return url.startsWith('/blogv2/');
      }),
      { numRuns: 100 }
    );
  });

  it('property: URL always ends with trailing slash', () => {
    const filePathArb = fc.array(
      fc.stringMatching(/^[a-z0-9-]+$/),
      { minLength: 1, maxLength: 5 }
    ).map(parts => parts.join('/') + '.md');

    fc.assert(
      fc.property(filePathArb, (filePath) => {
        const url = filePathToUrl(filePath);
        return url.endsWith('/');
      }),
      { numRuns: 100 }
    );
  });

  it('property: slug does not contain .md extension', () => {
    const filePathArb = fc.array(
      fc.stringMatching(/^[a-z0-9-]+$/),
      { minLength: 1, maxLength: 5 }
    ).map(parts => parts.join('/') + '.md');

    fc.assert(
      fc.property(filePathArb, (filePath) => {
        const slug = filePathToSlug(filePath);
        return !slug.includes('.md');
      }),
      { numRuns: 100 }
    );
  });

  it('property: URL path segments match file path segments', () => {
    const filePathArb = fc.array(
      fc.stringMatching(/^[a-z0-9-]+$/),
      { minLength: 1, maxLength: 5 }
    ).map(parts => parts.join('/') + '.md');

    fc.assert(
      fc.property(filePathArb, (filePath) => {
        const url = filePathToUrl(filePath);
        const expectedSegments = filePath.replace('.md', '').split('/');
        const urlSegments = url.replace('/blogv2/', '').replace(/\/$/, '').split('/');
        return JSON.stringify(expectedSegments) === JSON.stringify(urlSegments);
      }),
      { numRuns: 100 }
    );
  });
});
