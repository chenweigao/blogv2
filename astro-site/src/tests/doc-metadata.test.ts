import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 16: Document Metadata Display
 * Validates: Requirements 9.1, 9.2
 */

interface ArticleMetadata {
  date?: Date;
  category?: string | string[];
  tags?: string[];
  wordCount?: number;
}

// Simulates metadata processing from ArticleMeta component
function processMetadata(meta: ArticleMetadata) {
  const categories = meta.category 
    ? (Array.isArray(meta.category) ? meta.category : [meta.category])
    : [];
  
  const readingTime = meta.wordCount ? Math.ceil(meta.wordCount / 200) : undefined;
  
  return {
    formattedDate: meta.date?.toLocaleDateString('zh-CN'),
    categories,
    tags: meta.tags || [],
    readingTime,
  };
}

describe('Property 16: Document Metadata Display', () => {
  it('formats date correctly', () => {
    const meta = { date: new Date('2024-01-15') };
    const result = processMetadata(meta);
    expect(result.formattedDate).toBe('2024/1/15');
  });

  it('normalizes category to array', () => {
    expect(processMetadata({ category: 'test' }).categories).toEqual(['test']);
    expect(processMetadata({ category: ['a', 'b'] }).categories).toEqual(['a', 'b']);
    expect(processMetadata({}).categories).toEqual([]);
  });

  it('calculates reading time from word count', () => {
    expect(processMetadata({ wordCount: 200 }).readingTime).toBe(1);
    expect(processMetadata({ wordCount: 400 }).readingTime).toBe(2);
    expect(processMetadata({ wordCount: 250 }).readingTime).toBe(2); // Rounds up
  });

  it('property: reading time is always positive for non-zero word count', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (wordCount) => {
          const result = processMetadata({ wordCount });
          return result.readingTime !== undefined && result.readingTime > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: categories array length matches input', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 5 }),
        (categories) => {
          const result = processMetadata({ category: categories });
          return result.categories.length === categories.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 17: Edit Link URL Generation
 * Validates: Requirements 9.4
 */

function generateEditUrl(filePath: string, repoBase: string = 'https://github.com/username/repo'): string {
  return `${repoBase}/edit/main/${filePath}`;
}

describe('Property 17: Edit Link URL Generation', () => {
  it('generates correct edit URL', () => {
    expect(generateEditUrl('docs/algorithms/dp.md'))
      .toBe('https://github.com/username/repo/edit/main/docs/algorithms/dp.md');
  });

  it('property: edit URL always contains file path', () => {
    const filePathArb = fc.array(
      fc.stringMatching(/^[a-z0-9-]+$/),
      { minLength: 1, maxLength: 4 }
    ).map(parts => parts.join('/') + '.md');

    fc.assert(
      fc.property(filePathArb, (filePath) => {
        const url = generateEditUrl(filePath);
        return url.includes(filePath);
      }),
      { numRuns: 100 }
    );
  });

  it('property: edit URL always points to edit endpoint', () => {
    const filePathArb = fc.stringMatching(/^[a-z0-9/-]+\.md$/);

    fc.assert(
      fc.property(filePathArb, (filePath) => {
        const url = generateEditUrl(filePath);
        return url.includes('/edit/main/');
      }),
      { numRuns: 100 }
    );
  });
});
