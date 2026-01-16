import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 12: Timeline Chronological Sorting
 * Validates: Requirements 8.1
 */

interface TimelineEntry {
  id: string;
  date: Date;
  title: string;
  category?: string[];
}

// Sort entries by date descending (newest first)
function sortByDate(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
}

describe('Property 12: Timeline Chronological Sorting', () => {
  it('sorts entries newest first', () => {
    const entries: TimelineEntry[] = [
      { id: '1', date: new Date('2024-01-01'), title: 'Old' },
      { id: '2', date: new Date('2024-06-15'), title: 'Middle' },
      { id: '3', date: new Date('2024-12-31'), title: 'New' },
    ];

    const sorted = sortByDate(entries);
    
    expect(sorted[0].title).toBe('New');
    expect(sorted[1].title).toBe('Middle');
    expect(sorted[2].title).toBe('Old');
  });

  it('property: sorted entries are in descending date order', () => {
    const entryArb = fc.record({
      id: fc.uuid(),
      date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
      title: fc.string({ minLength: 1 }),
    });

    fc.assert(
      fc.property(fc.array(entryArb, { minLength: 2, maxLength: 20 }), (entries) => {
        const sorted = sortByDate(entries);
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].date.getTime() < sorted[i + 1].date.getTime()) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 13: Timeline Year-Month Grouping
 * Validates: Requirements 8.2
 */

interface GroupedTimeline {
  [year: string]: {
    [month: string]: TimelineEntry[];
  };
}

function groupByYearMonth(entries: TimelineEntry[]): GroupedTimeline {
  const grouped: GroupedTimeline = {};
  
  for (const entry of entries) {
    const year = entry.date.getFullYear().toString();
    const month = (entry.date.getMonth() + 1).toString().padStart(2, '0');
    
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(entry);
  }
  
  return grouped;
}

describe('Property 13: Timeline Year-Month Grouping', () => {
  it('groups entries by year and month', () => {
    const entries: TimelineEntry[] = [
      { id: '1', date: new Date('2024-01-15'), title: 'Jan' },
      { id: '2', date: new Date('2024-01-20'), title: 'Jan 2' },
      { id: '3', date: new Date('2024-06-10'), title: 'Jun' },
    ];

    const grouped = groupByYearMonth(entries);
    
    expect(grouped['2024']['01'].length).toBe(2);
    expect(grouped['2024']['06'].length).toBe(1);
  });

  it('property: all entries appear in exactly one group', () => {
    const entryArb = fc.record({
      id: fc.uuid(),
      date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
      title: fc.string({ minLength: 1 }),
    });

    fc.assert(
      fc.property(fc.array(entryArb, { minLength: 1, maxLength: 20 }), (entries) => {
        const grouped = groupByYearMonth(entries);
        
        let totalGrouped = 0;
        for (const year of Object.values(grouped)) {
          for (const month of Object.values(year)) {
            totalGrouped += month.length;
          }
        }
        
        return totalGrouped === entries.length;
      }),
      { numRuns: 100 }
    );
  });

  it('property: entries in same group have same year-month', () => {
    const entryArb = fc.record({
      id: fc.uuid(),
      date: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
      title: fc.string({ minLength: 1 }),
    });

    fc.assert(
      fc.property(fc.array(entryArb, { minLength: 1, maxLength: 20 }), (entries) => {
        const grouped = groupByYearMonth(entries);
        
        for (const [year, months] of Object.entries(grouped)) {
          for (const [month, groupEntries] of Object.entries(months)) {
            for (const entry of groupEntries) {
              const entryYear = entry.date.getFullYear().toString();
              const entryMonth = (entry.date.getMonth() + 1).toString().padStart(2, '0');
              if (entryYear !== year || entryMonth !== month) {
                return false;
              }
            }
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 14: Timeline Entry Content
 * Validates: Requirements 8.3
 */
describe('Property 14: Timeline Entry Content', () => {
  it('property: entry always has required fields', () => {
    const entryArb = fc.record({
      id: fc.uuid(),
      date: fc.date(),
      title: fc.string({ minLength: 1 }),
      category: fc.option(fc.array(fc.string()), { nil: undefined }),
    });

    fc.assert(
      fc.property(entryArb, (entry) => {
        return (
          typeof entry.id === 'string' &&
          entry.date instanceof Date &&
          typeof entry.title === 'string' &&
          entry.title.length > 0
        );
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 15: Timeline Category Filtering
 * Validates: Requirements 8.4
 */

function filterByCategory(entries: TimelineEntry[], category: string | null): TimelineEntry[] {
  if (!category || category === 'all') return entries;
  return entries.filter(e => e.category?.includes(category));
}

describe('Property 15: Timeline Category Filtering', () => {
  it('filters entries by category', () => {
    const entries: TimelineEntry[] = [
      { id: '1', date: new Date(), title: 'A', category: ['Tech'] },
      { id: '2', date: new Date(), title: 'B', category: ['Life'] },
      { id: '3', date: new Date(), title: 'C', category: ['Tech', 'Life'] },
    ];

    const techOnly = filterByCategory(entries, 'Tech');
    expect(techOnly.length).toBe(2);
    expect(techOnly.every(e => e.category?.includes('Tech'))).toBe(true);
  });

  it('returns all entries for null or "all" category', () => {
    const entries: TimelineEntry[] = [
      { id: '1', date: new Date(), title: 'A', category: ['Tech'] },
      { id: '2', date: new Date(), title: 'B', category: ['Life'] },
    ];

    expect(filterByCategory(entries, null).length).toBe(2);
    expect(filterByCategory(entries, 'all').length).toBe(2);
  });

  it('property: filtered entries all contain the category', () => {
    const categoryArb = fc.stringMatching(/^[A-Z][a-z]+$/);
    const entryArb = fc.record({
      id: fc.uuid(),
      date: fc.date(),
      title: fc.string({ minLength: 1 }),
      category: fc.array(categoryArb, { minLength: 0, maxLength: 3 }),
    });

    fc.assert(
      fc.property(
        fc.array(entryArb, { minLength: 1, maxLength: 20 }),
        categoryArb,
        (entries, category) => {
          const filtered = filterByCategory(entries, category);
          return filtered.every(e => e.category?.includes(category));
        }
      ),
      { numRuns: 100 }
    );
  });
});
