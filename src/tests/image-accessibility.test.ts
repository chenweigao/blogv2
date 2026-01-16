import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 18: Image Lazy Loading
 * Validates: Requirements 11.4
 */

interface ImageProps {
  src: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  aboveFold?: boolean;
}

function getImageLoading(props: ImageProps): 'lazy' | 'eager' {
  // Above-fold images should be eager, below-fold should be lazy
  if (props.aboveFold) return 'eager';
  return props.loading || 'lazy';
}

describe('Property 18: Image Lazy Loading', () => {
  it('defaults to lazy loading', () => {
    const props: ImageProps = { src: 'test.jpg', alt: 'test' };
    expect(getImageLoading(props)).toBe('lazy');
  });

  it('uses eager for above-fold images', () => {
    const props: ImageProps = { src: 'hero.jpg', alt: 'hero', aboveFold: true };
    expect(getImageLoading(props)).toBe('eager');
  });

  it('property: below-fold images always lazy', () => {
    fc.assert(
      fc.property(
        fc.record({
          src: fc.string({ minLength: 1 }),
          alt: fc.string(),
          aboveFold: fc.constant(false),
        }),
        (props) => {
          return getImageLoading(props) === 'lazy';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: above-fold images always eager', () => {
    fc.assert(
      fc.property(
        fc.record({
          src: fc.string({ minLength: 1 }),
          alt: fc.string(),
          aboveFold: fc.constant(true),
        }),
        (props) => {
          return getImageLoading(props) === 'eager';
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 21: Image Alt Text
 * Validates: Requirements 12.6
 */

function validateAltText(alt: string | undefined): { valid: boolean; alt: string } {
  if (!alt || alt.trim() === '') {
    return { valid: false, alt: 'Image' }; // Default fallback
  }
  return { valid: true, alt };
}

describe('Property 21: Image Alt Text', () => {
  it('accepts non-empty alt text', () => {
    const result = validateAltText('A beautiful sunset');
    expect(result.valid).toBe(true);
    expect(result.alt).toBe('A beautiful sunset');
  });

  it('provides default for empty alt', () => {
    expect(validateAltText('')).toEqual({ valid: false, alt: 'Image' });
    expect(validateAltText(undefined)).toEqual({ valid: false, alt: 'Image' });
    expect(validateAltText('   ')).toEqual({ valid: false, alt: 'Image' });
  });

  it('property: result always has non-empty alt', () => {
    fc.assert(
      fc.property(
        fc.option(fc.string(), { nil: undefined }),
        (alt) => {
          const result = validateAltText(alt);
          return result.alt.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: non-empty input is always valid', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (alt) => {
          const result = validateAltText(alt);
          return result.valid === true && result.alt === alt;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 20: Single H1 Per Page
 * Validates: Requirements 12.4
 */

function countH1(html: string): number {
  const matches = html.match(/<h1[^>]*>/gi);
  return matches ? matches.length : 0;
}

describe('Property 20: Single H1 Per Page', () => {
  it('counts h1 tags correctly', () => {
    expect(countH1('<h1>Title</h1>')).toBe(1);
    expect(countH1('<h1>One</h1><h1>Two</h1>')).toBe(2);
    expect(countH1('<h2>Not h1</h2>')).toBe(0);
  });

  it('property: valid page has exactly one h1', () => {
    // Simulate valid page structure
    const validPageArb = fc.string().map(content => 
      `<html><body><h1>Page Title</h1><main>${content}</main></body></html>`
    );

    fc.assert(
      fc.property(validPageArb, (html) => {
        return countH1(html) === 1;
      }),
      { numRuns: 100 }
    );
  });
});
