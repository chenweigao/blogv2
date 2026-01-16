/**
 * Contrast Audit Utility
 * Verifies WCAG AA contrast requirements for the design system
 * Requirements: 1.7, 3.8, 5.8, 7.5, 10.1
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string
 * @returns {object} RGB values
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Parse rgba color string
 * @param {string} rgba - RGBA color string
 * @returns {object} RGBA values
 */
function parseRgba(rgba) {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1
    };
  }
  return null;
}

/**
 * Calculate relative luminance
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {number} Relative luminance
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @param {object} color1 - First color {r, g, b}
 * @param {object} color2 - Second color {r, g, b}
 * @returns {number} Contrast ratio
 */
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1.r, color1.g, color1.b);
  const l2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA requirements
 * @param {number} ratio - Contrast ratio
 * @param {boolean} isLargeText - Whether text is large (>=18px or >=14px bold)
 * @returns {boolean} Whether contrast meets requirements
 */
function meetsWcagAA(ratio, isLargeText = false) {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// Design token color definitions - Light Mode
const lightModeColors = {
  // Text colors
  textPrimary: '#1D1D1F',
  textSecondary: '#6E6E73',
  textTertiary: '#86868B',
  textQuaternary: '#AEAEB2',
  
  // Background colors
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F5F5F7',
  bgTertiary: '#FAFAFA',
  
  // Brand colors
  brandPrimary: '#5E5CE6',
  brandSecondary: '#7B7BF7',
  
  // Glass backgrounds (approximated solid colors for contrast calculation)
  glassNavbar: '#FFFFFF', // rgba(255, 255, 255, 0.8) on white
  glassSidebar: '#FFFFFF', // rgba(255, 255, 255, 0.7) on white
  glassCard: '#FFFFFF', // rgba(255, 255, 255, 0.75) on white
  
  // Code block
  codeBlockBg: '#F5F5F7',
};

// Design token color definitions - Dark Mode
const darkModeColors = {
  // Text colors
  textPrimary: '#F5F5F7',
  textSecondary: '#A1A1A6',
  textTertiary: '#8E8E93',
  textQuaternary: '#636366',
  
  // Background colors
  bgPrimary: '#000000',
  bgSecondary: '#1C1C1E',
  bgTertiary: '#2C2C2E',
  
  // Brand colors
  brandPrimary: '#7B7BF7',
  brandSecondary: '#9B9BFF',
  
  // Glass backgrounds (approximated solid colors for contrast calculation)
  glassNavbar: '#1C1C1E', // rgba(28, 28, 30, 0.85) on black
  glassSidebar: '#1C1C1E', // rgba(28, 28, 30, 0.75) on black
  glassCard: '#1C1C1E', // rgba(28, 28, 30, 0.8) on black
  
  // Code block
  codeBlockBg: '#1C1C1E',
};

// Color combinations to test
const colorCombinations = [
  // Light mode - Body text on backgrounds
  { name: 'Light: Primary text on primary bg', text: 'textPrimary', bg: 'bgPrimary', mode: 'light', isLarge: false },
  { name: 'Light: Primary text on secondary bg', text: 'textPrimary', bg: 'bgSecondary', mode: 'light', isLarge: false },
  { name: 'Light: Secondary text on primary bg', text: 'textSecondary', bg: 'bgPrimary', mode: 'light', isLarge: false },
  { name: 'Light: Secondary text on secondary bg', text: 'textSecondary', bg: 'bgSecondary', mode: 'light', isLarge: false },
  
  // Light mode - Text on glass backgrounds
  { name: 'Light: Primary text on navbar glass', text: 'textPrimary', bg: 'glassNavbar', mode: 'light', isLarge: false },
  { name: 'Light: Primary text on sidebar glass', text: 'textPrimary', bg: 'glassSidebar', mode: 'light', isLarge: false },
  { name: 'Light: Primary text on card glass', text: 'textPrimary', bg: 'glassCard', mode: 'light', isLarge: false },
  
  // Light mode - Brand colors
  { name: 'Light: Brand primary on primary bg', text: 'brandPrimary', bg: 'bgPrimary', mode: 'light', isLarge: false },
  { name: 'Light: Brand primary on secondary bg', text: 'brandPrimary', bg: 'bgSecondary', mode: 'light', isLarge: false },
  
  // Light mode - Code blocks
  { name: 'Light: Primary text on code block bg', text: 'textPrimary', bg: 'codeBlockBg', mode: 'light', isLarge: false },
  
  // Light mode - Large text (headings)
  { name: 'Light: Primary text on primary bg (large)', text: 'textPrimary', bg: 'bgPrimary', mode: 'light', isLarge: true },
  { name: 'Light: Brand primary on primary bg (large)', text: 'brandPrimary', bg: 'bgPrimary', mode: 'light', isLarge: true },
  
  // Dark mode - Body text on backgrounds
  { name: 'Dark: Primary text on primary bg', text: 'textPrimary', bg: 'bgPrimary', mode: 'dark', isLarge: false },
  { name: 'Dark: Primary text on secondary bg', text: 'textPrimary', bg: 'bgSecondary', mode: 'dark', isLarge: false },
  { name: 'Dark: Secondary text on primary bg', text: 'textSecondary', bg: 'bgPrimary', mode: 'dark', isLarge: false },
  { name: 'Dark: Secondary text on secondary bg', text: 'textSecondary', bg: 'bgSecondary', mode: 'dark', isLarge: false },
  
  // Dark mode - Text on glass backgrounds
  { name: 'Dark: Primary text on navbar glass', text: 'textPrimary', bg: 'glassNavbar', mode: 'dark', isLarge: false },
  { name: 'Dark: Primary text on sidebar glass', text: 'textPrimary', bg: 'glassSidebar', mode: 'dark', isLarge: false },
  { name: 'Dark: Primary text on card glass', text: 'textPrimary', bg: 'glassCard', mode: 'dark', isLarge: false },
  
  // Dark mode - Brand colors
  { name: 'Dark: Brand primary on primary bg', text: 'brandPrimary', bg: 'bgPrimary', mode: 'dark', isLarge: false },
  { name: 'Dark: Brand primary on secondary bg', text: 'brandPrimary', bg: 'bgSecondary', mode: 'dark', isLarge: false },
  
  // Dark mode - Code blocks
  { name: 'Dark: Primary text on code block bg', text: 'textPrimary', bg: 'codeBlockBg', mode: 'dark', isLarge: false },
  
  // Dark mode - Large text (headings)
  { name: 'Dark: Primary text on primary bg (large)', text: 'textPrimary', bg: 'bgPrimary', mode: 'dark', isLarge: true },
  { name: 'Dark: Brand primary on primary bg (large)', text: 'brandPrimary', bg: 'bgPrimary', mode: 'dark', isLarge: true },
];

/**
 * Run the contrast audit
 */
function runContrastAudit() {
  console.log('='.repeat(60));
  console.log('WCAG AA Contrast Audit Report');
  console.log('Requirements: 1.7, 3.8, 5.8, 7.5, 10.1');
  console.log('='.repeat(60));
  console.log('');
  console.log('WCAG AA Requirements:');
  console.log('  - Normal text (< 18px): minimum 4.5:1 contrast ratio');
  console.log('  - Large text (>= 18px or >= 14px bold): minimum 3:1 contrast ratio');
  console.log('');
  console.log('-'.repeat(60));
  
  let passCount = 0;
  let failCount = 0;
  const failures = [];
  
  for (const combo of colorCombinations) {
    const colors = combo.mode === 'light' ? lightModeColors : darkModeColors;
    const textColor = hexToRgb(colors[combo.text]);
    const bgColor = hexToRgb(colors[combo.bg]);
    
    if (!textColor || !bgColor) {
      console.log(`⚠️  Could not parse colors for: ${combo.name}`);
      continue;
    }
    
    const ratio = getContrastRatio(textColor, bgColor);
    const passes = meetsWcagAA(ratio, combo.isLarge);
    const minRequired = combo.isLarge ? 3 : 4.5;
    
    if (passes) {
      passCount++;
      console.log(`✅ PASS: ${combo.name}`);
      console.log(`   Ratio: ${ratio.toFixed(2)}:1 (required: ${minRequired}:1)`);
    } else {
      failCount++;
      failures.push({ ...combo, ratio, minRequired });
      console.log(`❌ FAIL: ${combo.name}`);
      console.log(`   Ratio: ${ratio.toFixed(2)}:1 (required: ${minRequired}:1)`);
    }
    console.log('');
  }
  
  console.log('-'.repeat(60));
  console.log('SUMMARY');
  console.log('-'.repeat(60));
  console.log(`Total tests: ${passCount + failCount}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log('');
  
  if (failures.length > 0) {
    console.log('FAILURES REQUIRING ATTENTION:');
    for (const failure of failures) {
      console.log(`  - ${failure.name}: ${failure.ratio.toFixed(2)}:1 (need ${failure.minRequired}:1)`);
    }
  } else {
    console.log('🎉 All color combinations meet WCAG AA requirements!');
  }
  
  console.log('');
  console.log('='.repeat(60));
  
  return { passCount, failCount, failures };
}

// Run the audit
const results = runContrastAudit();

// Exit with error code if there are failures
if (results.failCount > 0) {
  process.exit(1);
}
