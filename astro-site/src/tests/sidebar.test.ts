import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { buildSidebar, getTitle, isActive, isExactActive } from '../lib/sidebar';

/**
 * Property 6: Sidebar Generation from Folder Structure
 * Validates: Requirements 5.3
 */

interface MockEntry {
  id: string;
  data: {
    title?: string;
    order?: number;
  };
}

describe('Property 6: Sidebar Generation from Folder Structure', () => {
  it('generates sections from top-level folders', () => {
    const entries: MockEntry[] = [
      { id: 'algorithms/dp', data: { title: 'Dynamic Programming' } },
      { id: 'algorithms/sort', data: { title: 'Sorting' } },
      { id: 'systems/linux', data: { title: 'Linux' } },
    ];

    const sidebar = buildSidebar(entries);
    
    expect(sidebar.length).toBe(2);
    expect(sidebar.map(s => s.title).sort()).toEqual(['Algorithms', 'Systems']);
  });

  it('includes all entries in sidebar', () => {
    const entries: MockEntry[] = [
      { id: 'a/b', data: {} },
      { id: 'a/c', data: {} },
      { id: 'x/y', data: {} },
    ];

    const sidebar = buildSidebar(entries);
    const totalItems = sidebar.reduce((sum, section) => sum + section.items.length, 0);
    
    expect(totalItems).toBe(3);
  });

  it('property: every entry appears in sidebar', () => {
    const entryArb = fc.record({
      id: fc.array(fc.stringMatching(/^[a-z]+$/), { minLength: 1, maxLength: 3 })
        .map(parts => parts.join('/')),
      data: fc.record({
        title: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
        order: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
      }),
    });

    fc.assert(
      fc.property(fc.array(entryArb, { minLength: 1, maxLength: 10 }), (entries) => {
        const sidebar = buildSidebar(entries);
        const allHrefs = sidebar.flatMap(s => 
          s.items.flatMap(item => [item.href, ...(item.children?.map(c => c.href) || [])])
        );
        
        // Every entry should have a corresponding href
        return entries.every(entry => 
          allHrefs.some(href => href.includes(entry.id.replace(/\.md$/, '')))
        );
      }),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 7: Sidebar Active State
 * Validates: Requirements 5.5
 */
describe('Property 7: Sidebar Active State', () => {
  it('marks exact path as active', () => {
    expect(isActive('/blogv2/algorithms/dp/', '/blogv2/algorithms/dp/')).toBe(true);
    expect(isExactActive('/blogv2/algorithms/dp/', '/blogv2/algorithms/dp/')).toBe(true);
  });

  it('marks parent path as active', () => {
    expect(isActive('/blogv2/algorithms/', '/blogv2/algorithms/dp/')).toBe(true);
    expect(isExactActive('/blogv2/algorithms/', '/blogv2/algorithms/dp/')).toBe(false);
  });

  it('does not mark unrelated path as active', () => {
    expect(isActive('/blogv2/systems/', '/blogv2/algorithms/dp/')).toBe(false);
  });

  it('property: exact match is always active', () => {
    const pathArb = fc.array(fc.stringMatching(/^[a-z]+$/), { minLength: 1, maxLength: 4 })
      .map(parts => '/blogv2/' + parts.join('/') + '/');

    fc.assert(
      fc.property(pathArb, (path) => {
        return isActive(path, path) && isExactActive(path, path);
      }),
      { numRuns: 100 }
    );
  });

  it('property: child path makes parent active but not exact', () => {
    const pathArb = fc.array(fc.stringMatching(/^[a-z]+$/), { minLength: 2, maxLength: 4 })
      .map(parts => '/blogv2/' + parts.join('/') + '/');

    fc.assert(
      fc.property(pathArb, (childPath) => {
        const parts = childPath.split('/').filter(Boolean);
        if (parts.length < 3) return true; // Need at least blogv2/parent/child
        
        const parentPath = '/' + parts.slice(0, -1).join('/') + '/';
        return isActive(parentPath, childPath) && !isExactActive(parentPath, childPath);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 8: Sidebar Text from Frontmatter
 * Validates: Requirements 5.7
 */
describe('Property 8: Sidebar Text from Frontmatter', () => {
  it('uses frontmatter title when available', () => {
    const entry: MockEntry = { id: 'test/file', data: { title: 'Custom Title' } };
    expect(getTitle(entry)).toBe('Custom Title');
  });

  it('falls back to formatted filename when no title', () => {
    const entry: MockEntry = { id: 'test/my-file', data: {} };
    expect(getTitle(entry)).toBe('My File');
  });

  it('property: title is never empty', () => {
    const entryArb = fc.record({
      id: fc.array(fc.stringMatching(/^[a-z-]+$/), { minLength: 1, maxLength: 3 })
        .map(parts => parts.join('/')),
      data: fc.record({
        title: fc.option(fc.string(), { nil: undefined }),
      }),
    });

    fc.assert(
      fc.property(entryArb, (entry) => {
        const title = getTitle(entry);
        return title.length > 0;
      }),
      { numRuns: 100 }
    );
  });

  it('property: frontmatter title takes precedence', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.stringMatching(/^[a-z-]+$/),
        (title, filename) => {
          const entry: MockEntry = { id: `folder/${filename}`, data: { title } };
          return getTitle(entry) === title;
        }
      ),
      { numRuns: 100 }
    );
  });
});
