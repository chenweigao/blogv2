import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 9: Theme Persistence Round-Trip
 * Validates: Requirements 6.3
 * 
 * Tests that theme value persists correctly to localStorage
 */

// Mock localStorage for testing
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// Theme logic extracted from ThemeToggle component
type Theme = 'light' | 'dark';

function getTheme(storage: MockLocalStorage, prefersDark: boolean): Theme {
  const stored = storage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

function setTheme(storage: MockLocalStorage, theme: Theme): void {
  storage.setItem('theme', theme);
}

function toggleTheme(storage: MockLocalStorage, prefersDark: boolean): Theme {
  const current = getTheme(storage, prefersDark);
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(storage, next);
  return next;
}

describe('Property 9: Theme Persistence Round-Trip', () => {
  let storage: MockLocalStorage;

  beforeEach(() => {
    storage = new MockLocalStorage();
  });

  it('persists light theme to localStorage', () => {
    setTheme(storage, 'light');
    expect(storage.getItem('theme')).toBe('light');
  });

  it('persists dark theme to localStorage', () => {
    setTheme(storage, 'dark');
    expect(storage.getItem('theme')).toBe('dark');
  });

  it('retrieves persisted theme correctly', () => {
    setTheme(storage, 'dark');
    expect(getTheme(storage, false)).toBe('dark');
    
    setTheme(storage, 'light');
    expect(getTheme(storage, true)).toBe('light');
  });

  it('falls back to system preference when no stored theme', () => {
    expect(getTheme(storage, true)).toBe('dark');
    expect(getTheme(storage, false)).toBe('light');
  });

  it('property: theme round-trip preserves value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark'),
        (theme) => {
          const store = new MockLocalStorage();
          setTheme(store, theme);
          return getTheme(store, false) === theme && getTheme(store, true) === theme;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: toggle always changes theme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark'),
        fc.boolean(),
        (initialTheme, prefersDark) => {
          const store = new MockLocalStorage();
          setTheme(store, initialTheme);
          const before = getTheme(store, prefersDark);
          const after = toggleTheme(store, prefersDark);
          return before !== after;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: double toggle returns to original theme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark'),
        fc.boolean(),
        (initialTheme, prefersDark) => {
          const store = new MockLocalStorage();
          setTheme(store, initialTheme);
          toggleTheme(store, prefersDark);
          toggleTheme(store, prefersDark);
          return getTheme(store, prefersDark) === initialTheme;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: stored theme overrides system preference', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark'),
        fc.boolean(),
        (storedTheme, prefersDark) => {
          const store = new MockLocalStorage();
          setTheme(store, storedTheme);
          // Regardless of system preference, stored theme wins
          return getTheme(store, prefersDark) === storedTheme;
        }
      ),
      { numRuns: 100 }
    );
  });
});
