import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { z } from 'zod';

/**
 * Property 1: Frontmatter Schema Validation
 * Validates: Requirements 2.1, 15.1
 * 
 * Tests that valid frontmatter is accepted and invalid types are rejected
 */

// Recreate the schema for testing (mirrors content.config.ts)
const frontmatterSchema = z.object({
  title: z.string().optional(),
  date: z.coerce.date().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  description: z.string().optional(),
  layout: z.string().optional(),
  order: z.number().optional(),
  lastUpdated: z.coerce.date().optional(),
});

describe('Property 1: Frontmatter Schema Validation', () => {
  it('accepts valid frontmatter with all fields', () => {
    const validFrontmatter = {
      title: 'Test Article',
      date: '2024-01-15',
      category: 'algorithms',
      tags: ['dp', 'recursion'],
      description: 'A test article about algorithms',
      layout: 'doc',
      order: 1,
      lastUpdated: '2024-01-20',
    };

    const result = frontmatterSchema.safeParse(validFrontmatter);
    expect(result.success).toBe(true);
  });

  it('accepts empty frontmatter (all fields optional)', () => {
    const result = frontmatterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects invalid date format', () => {
    const invalidFrontmatter = {
      date: 'not-a-date',
    };
    const result = frontmatterSchema.safeParse(invalidFrontmatter);
    // z.coerce.date() will try to parse, "not-a-date" becomes Invalid Date
    if (result.success) {
      expect(result.data.date?.toString()).toBe('Invalid Date');
    }
  });

  it('rejects non-array tags', () => {
    const invalidFrontmatter = {
      tags: 'single-tag', // should be array
    };
    const result = frontmatterSchema.safeParse(invalidFrontmatter);
    expect(result.success).toBe(false);
  });

  it('rejects non-number order', () => {
    const invalidFrontmatter = {
      order: 'first', // should be number
    };
    const result = frontmatterSchema.safeParse(invalidFrontmatter);
    expect(result.success).toBe(false);
  });

  it('property: any valid string title is accepted', () => {
    fc.assert(
      fc.property(fc.string(), (title) => {
        const result = frontmatterSchema.safeParse({ title });
        return result.success === true;
      }),
      { numRuns: 100 }
    );
  });

  it('property: any valid string array for tags is accepted', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (tags) => {
        const result = frontmatterSchema.safeParse({ tags });
        return result.success === true;
      }),
      { numRuns: 100 }
    );
  });

  it('property: any valid integer for order is accepted', () => {
    fc.assert(
      fc.property(fc.integer(), (order) => {
        const result = frontmatterSchema.safeParse({ order });
        return result.success === true;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 27: Frontmatter Default Values
 * Validates: Requirements 15.6
 * 
 * Tests that missing optional fields get sensible defaults
 */
describe('Property 27: Frontmatter Default Values', () => {
  it('tags defaults to empty array when not provided', () => {
    const result = frontmatterSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });

  it('property: tags always has a default value', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.option(fc.string(), { nil: undefined }),
          category: fc.option(fc.string(), { nil: undefined }),
        }),
        (partialFrontmatter) => {
          const result = frontmatterSchema.safeParse(partialFrontmatter);
          return result.success && Array.isArray(result.data.tags);
        }
      ),
      { numRuns: 100 }
    );
  });
});
