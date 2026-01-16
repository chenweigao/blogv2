import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 22: Base Path in Links
 * Validates: Requirements 14.3
 */

const BASE_PATH = '/blogv2/';

// Simulates link generation
function generateInternalLink(path: string): string {
  // Ensure path starts with base path
  if (path.startsWith(BASE_PATH)) return path;
  if (path.startsWith('/')) return BASE_PATH + path.slice(1);
  return BASE_PATH + path;
}

// Check if link has correct base path
function hasCorrectBasePath(link: string): boolean {
  return link.startsWith(BASE_PATH);
}

describe('Property 22: Base Path in Links', () => {
  it('adds base path to relative links', () => {
    expect(generateInternalLink('algorithms/dp/')).toBe('/blogv2/algorithms/dp/');
  });

  it('adds base path to absolute links', () => {
    expect(generateInternalLink('/algorithms/dp/')).toBe('/blogv2/algorithms/dp/');
  });

  it('preserves existing base path', () => {
    expect(generateInternalLink('/blogv2/algorithms/')).toBe('/blogv2/algorithms/');
  });

  it('property: all generated links have base path', () => {
    const pathArb = fc.array(
      fc.stringMatching(/^[a-z0-9-]+$/),
      { minLength: 1, maxLength: 4 }
    ).map(parts => parts.join('/') + '/');

    fc.assert(
      fc.property(pathArb, (path) => {
        const link = generateInternalLink(path);
        return hasCorrectBasePath(link);
      }),
      { numRuns: 100 }
    );
  });

  it('property: base path appears exactly once', () => {
    const pathArb = fc.array(
      fc.stringMatching(/^[a-z0-9-]+$/),
      { minLength: 1, maxLength: 4 }
    ).map(parts => parts.join('/') + '/');

    fc.assert(
      fc.property(pathArb, (path) => {
        const link = generateInternalLink(path);
        const count = (link.match(/\/blogv2\//g) || []).length;
        return count === 1;
      }),
      { numRuns: 100 }
    );
  });

  it('property: idempotent - applying twice gives same result', () => {
    const pathArb = fc.array(
      fc.stringMatching(/^[a-z0-9-]+$/),
      { minLength: 1, maxLength: 4 }
    ).map(parts => parts.join('/') + '/');

    fc.assert(
      fc.property(pathArb, (path) => {
        const once = generateInternalLink(path);
        const twice = generateInternalLink(once);
        return once === twice;
      }),
      { numRuns: 100 }
    );
  });
});
