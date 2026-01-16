import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 10: Color Contrast Compliance
 * Validates: Requirements 6.6
 * 
 * Tests that all text/background color pairs meet WCAG AA (4.5:1 ratio)
 */

// Design token color pairs to test
const colorPairs = [
  // Light mode
  { text: '#0F172A', bg: '#F8FAFC', name: 'light: text on bg' },
  { text: '#475569', bg: '#F8FAFC', name: 'light: muted text on bg' },
  { text: '#0F172A', bg: '#F1F5F9', name: 'light: text on secondary bg' },
  { text: '#FFFFFF', bg: '#5E5CE6', name: 'light: white on primary' },
  // Dark mode
  { text: '#F8FAFC', bg: '#0F172A', name: 'dark: text on bg' },
  { text: '#94A3B8', bg: '#0F172A', name: 'dark: muted text on bg' },
  { text: '#F8FAFC', bg: '#1E293B', name: 'dark: text on secondary bg' },
  { text: '#FFFFFF', bg: '#5E5CE6', name: 'dark: white on primary' },
];

// Parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid hex color: ${hex}`);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

// Calculate relative luminance per WCAG 2.1
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio per WCAG 2.1
function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(hexToRgb(color1));
  const l2 = getLuminance(hexToRgb(color2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Property 10: Color Contrast Compliance', () => {
  it('all design token color pairs meet WCAG AA (4.5:1)', () => {
    for (const pair of colorPairs) {
      const ratio = getContrastRatio(pair.text, pair.bg);
      expect(
        ratio,
        `${pair.name}: contrast ratio ${ratio.toFixed(2)} should be >= 4.5`
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('property: any valid hex color pair can be tested for contrast', () => {
    // Generate valid hex color strings
    const hexColorArb = fc
      .tuple(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 })
      )
      .map(([r, g, b]) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);

    fc.assert(
      fc.property(hexColorArb, hexColorArb, (color1, color2) => {
        const ratio = getContrastRatio(color1, color2);
        // Contrast ratio is always between 1 and 21
        return ratio >= 1 && ratio <= 21;
      }),
      { numRuns: 100 }
    );
  });

  it('property: contrast ratio is symmetric', () => {
    const hexColorArb = fc
      .tuple(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 })
      )
      .map(([r, g, b]) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);

    fc.assert(
      fc.property(hexColorArb, hexColorArb, (color1, color2) => {
        const ratio1 = getContrastRatio(color1, color2);
        const ratio2 = getContrastRatio(color2, color1);
        return Math.abs(ratio1 - ratio2) < 0.0001;
      }),
      { numRuns: 100 }
    );
  });
});
