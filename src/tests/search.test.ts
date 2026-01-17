import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 11: Search Results Content
 * Validates: Requirements 7.3, 7.6
 */

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  category?: string;
}

// Simulates search result processing
function processSearchResult(raw: any): SearchResult {
  return {
    url: raw.url || '',
    title: raw.meta?.title || 'Untitled',
    excerpt: raw.excerpt || '',
    category: raw.meta?.category,
  };
}

// Simulates highlighting matching terms
function highlightMatches(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

describe('Property 11: Search Results Content', () => {
  it('processes result with all fields', () => {
    const raw = {
      url: '/algorithms/dp/',
      meta: { title: 'Dynamic Programming', category: 'Algorithms' },
      excerpt: 'Learn about DP techniques',
    };
    
    const result = processSearchResult(raw);
    
    expect(result.url).toBe('/algorithms/dp/');
    expect(result.title).toBe('Dynamic Programming');
    expect(result.excerpt).toBe('Learn about DP techniques');
    expect(result.category).toBe('Algorithms');
  });

  it('provides default title when missing', () => {
    const raw = { url: '/test/', excerpt: 'test' };
    const result = processSearchResult(raw);
    expect(result.title).toBe('Untitled');
  });

  it('highlights matching terms', () => {
    const text = 'Learn about dynamic programming';
    const highlighted = highlightMatches(text, 'dynamic');
    expect(highlighted).toBe('Learn about <mark>dynamic</mark> programming');
  });

  it('property: processed result always has required fields', () => {
    const rawArb = fc.record({
      url: fc.webUrl(),
      meta: fc.option(fc.record({
        title: fc.option(fc.string(), { nil: undefined }),
        category: fc.option(fc.string(), { nil: undefined }),
      }), { nil: undefined }),
      excerpt: fc.option(fc.string(), { nil: undefined }),
    });

    fc.assert(
      fc.property(rawArb, (raw) => {
        const result = processSearchResult(raw);
        return (
          typeof result.url === 'string' &&
          typeof result.title === 'string' &&
          typeof result.excerpt === 'string'
        );
      }),
      { numRuns: 100 }
    );
  });

  it('property: highlighting preserves original text content', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }),
        fc.stringMatching(/^[a-z]+$/),
        (text, query) => {
          const highlighted = highlightMatches(text, query);
          // Remove mark tags and compare
          const stripped = highlighted.replace(/<\/?mark>/g, '');
          return stripped === text;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: empty query returns unchanged text', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        return highlightMatches(text, '') === text;
      }),
      { numRuns: 100 }
    );
  });
});
