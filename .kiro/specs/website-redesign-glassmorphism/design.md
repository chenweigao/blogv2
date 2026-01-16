# Design Document: VitePress Website Redesign with Glassmorphism

## Overview

This design document outlines the technical approach for redesigning the VitePress documentation website with a modern SaaS analytics dashboard style, inspired by Apple and Linear design language. The redesign leverages the existing design token system while enhancing it with refined glassmorphism effects, soft shadows, and polished visual details.

### Design Philosophy

The redesign follows these core principles:
- **Glassmorphism**: Semi-transparent backgrounds with backdrop blur, subtle borders, and layered depth
- **Soft Shadows**: Multi-layered, diffused shadows with low opacity for subtle depth perception
- **Apple/Linear Aesthetics**: Clean typography, generous whitespace, refined animations
- **Accessibility First**: WCAG AA compliance, keyboard navigation, reduced motion support
- **Progressive Enhancement**: Graceful degradation for browsers without backdrop-filter support

### Technology Stack

- **Framework**: VitePress (Vue 3-based static site generator)
- **Styling**: CSS with CSS Custom Properties (design tokens)
- **Components**: Vue 3 Single File Components
- **Fonts**: SF Pro / System font stack, SF Mono / JetBrains Mono for code

## Architecture

### File Structure

```
docs/.vitepress/theme/
├── styles/
│   ├── design-tokens.css      # Core design tokens (colors, shadows, spacing)
│   ├── variables.css          # VitePress variable overrides
│   ├── base.css               # Base styles and utility classes
│   ├── components.css         # Component-specific styles
│   ├── navbar.css             # NEW: Navbar glassmorphism styles
│   ├── sidebar.css            # NEW: Sidebar refinement styles
│   ├── content.css            # Content area typography
│   ├── code-blocks.css        # NEW: Modern code block styles
│   ├── home.css               # Hero and features styling
│   ├── cards.css              # NEW: Card component styles
│   ├── animations.css         # Animation definitions
│   ├── responsive.css         # Responsive breakpoints
│   └── accessibility.css      # Accessibility enhancements
├── components/
│   ├── layout/
│   │   ├── GlassNavbar.vue    # NEW: Enhanced navbar component
│   │   └── GlassSidebar.vue   # NEW: Enhanced sidebar component
│   └── ui/
│       ├── GlassCard.vue      # NEW: Reusable glass card component
│       └── CodeBlock.vue      # NEW: Enhanced code block component
└── index.js                   # Theme entry point
```

### Design Token Architecture

The design system uses a layered token architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Semantic Tokens                          │
│  (--vp-c-brand-1, --vp-shadow-hover, --vp-radius-card)     │
├─────────────────────────────────────────────────────────────┤
│                    Primitive Tokens                         │
│  (--apple-brand-primary, --shadow-lg, --radius-xl)         │
├─────────────────────────────────────────────────────────────┤
│                    Base Values                              │
│  (colors, spacing scale, timing functions)                  │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Navbar Component

```
┌────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 🔷 Logo    Nav Item 1    Nav Item 2    Nav Item 3    🌙 🔍  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                         ↑ 16px margin from edges                   │
└────────────────────────────────────────────────────────────────────┘
```

**CSS Interface:**
```css
.VPNav {
  /* Glassmorphism properties */
  --navbar-bg: var(--vp-c-bg-glass);
  --navbar-blur: var(--vp-blur-lg);           /* 24px */
  --navbar-border: var(--vp-c-border-glass);
  --navbar-shadow: var(--vp-shadow-3);
  
  /* Floating layout */
  --navbar-margin: 16px;
  --navbar-radius: var(--vp-border-radius-xl); /* 16px */
  
  /* Transitions */
  --navbar-transition: var(--vp-animation-duration-normal) 
                       var(--vp-animation-easing-expo-out);
}
```

### 2. Sidebar Component

```
┌─────────────────────────┐
│  Section Title          │
│  ├─ Item 1              │
│  ├─ Item 2 (active) ◀──│── 3px brand border
│  └─ Item 3              │
│                         │
│  Section Title 2        │
│  ├─ Item 4              │
│  └─ Item 5              │
└─────────────────────────┘
```

**CSS Interface:**
```css
.VPSidebar {
  /* Glassmorphism properties */
  --sidebar-bg: var(--vp-c-bg-glass-light);
  --sidebar-blur: var(--vp-blur-sm);          /* 8px */
  
  /* Active item styling */
  --sidebar-active-border: 3px solid var(--vp-c-brand-1);
  --sidebar-active-bg: var(--vp-c-brand-soft);
  
  /* Spacing */
  --sidebar-item-padding: var(--vp-space-8) var(--vp-space-12);
  --sidebar-section-gap: var(--vp-space-24);
}
```

### 3. Card Component

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │  Icon                       │   │
│  │  Title                      │   │
│  │  Description text that      │   │
│  │  wraps to multiple lines    │   │
│  │                    →        │   │
│  └─────────────────────────────┘   │
│         ↑ Soft shadow              │
└─────────────────────────────────────┘
```

**Vue Component Interface:**
```typescript
interface GlassCardProps {
  title: string;
  description?: string;
  icon?: string;
  link?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}
```

### 4. Code Block Component

```
┌─────────────────────────────────────────────┐
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ ← Brand accent border
│  javascript                        [Copy]   │
│ ─────────────────────────────────────────── │
│  1 │ const greeting = 'Hello';              │
│  2 │ console.log(greeting);                 │
│  3 │                                        │
└─────────────────────────────────────────────┘
```

**CSS Interface:**
```css
.vp-code-block {
  /* Background */
  --code-bg: var(--vp-c-bg-alt);
  --code-bg-glass: var(--vp-c-bg-glass-light);
  
  /* Accent */
  --code-accent: var(--vp-c-brand-1);
  --code-accent-height: 3px;
  
  /* Typography */
  --code-font: var(--vp-font-family-mono);
  --code-font-size: 14px;
  --code-line-height: 1.6;
  
  /* Border radius */
  --code-radius: var(--vp-border-radius-large); /* 12px */
}
```

### 5. Hero Section Component

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              ╭─────────────────────────────────╮                │
│              │     Gradient Background         │                │
│              │                                 │                │
│              │    ✨ Knowledge Wiki ✨         │ ← Gradient text │
│              │    Personal Knowledge Base      │                │
│              │                                 │                │
│              │  [Get Started]  [View GitHub]   │                │
│              │       ↑              ↑          │                │
│              │    Primary       Secondary      │                │
│              ╰─────────────────────────────────╯                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Models

### Design Token Schema

```typescript
interface DesignTokens {
  // Color tokens
  colors: {
    brand: {
      primary: string;      // #5E5CE6
      secondary: string;    // #7B7BF7
      tertiary: string;     // #4B4ACF
      soft: string;         // rgba(94, 92, 230, 0.12)
    };
    background: {
      primary: string;
      secondary: string;
      glass: string;
      glassHeavy: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    border: {
      primary: string;
      glass: string;
    };
  };
  
  // Shadow tokens
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    hover: string;
    brand: {
      sm: string;
      md: string;
      lg: string;
    };
  };
  
  // Spacing tokens
  spacing: {
    [key: string]: string;  // space-1 through space-24
  };
  
  // Border radius tokens
  radius: {
    xs: string;     // 4px
    sm: string;     // 6px
    md: string;     // 8px
    lg: string;     // 12px
    xl: string;     // 16px
    '2xl': string;  // 20px
    card: string;   // 16px
    button: string; // 8px
  };
  
  // Animation tokens
  animation: {
    duration: {
      fast: string;    // 150ms
      normal: string;  // 250ms
      slow: string;    // 350ms
    };
    easing: {
      default: string;
      expoOut: string;
      spring: string;
    };
  };
  
  // Blur tokens
  blur: {
    sm: string;   // 8px
    md: string;   // 16px
    lg: string;   // 24px
    xl: string;   // 40px
  };
}
```

### Theme Configuration Schema

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark';
  glassmorphism: {
    enabled: boolean;
    fallbackOpacity: number;
  };
  animations: {
    enabled: boolean;
    respectReducedMotion: boolean;
  };
  accessibility: {
    minContrastRatio: number;  // 4.5 for WCAG AA
    focusRingWidth: string;
    focusRingColor: string;
  };
}
```

### Component State Schema

```typescript
interface NavbarState {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  activeItem: string | null;
}

interface SidebarState {
  isOpen: boolean;
  expandedSections: string[];
  activeItem: string;
}

interface CodeBlockState {
  isCopied: boolean;
  isHovered: boolean;
  language: string;
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following correctness properties have been identified and consolidated to eliminate redundancy:

### Property 1: Glassmorphism Blur Consistency

*For any* component that uses glassmorphism (Navbar, Sidebar, Cards), the backdrop-filter blur value SHALL be within the specified range for that component type (Navbar: 16-24px, Sidebar: 8-12px, Cards: 12-16px).

**Validates: Requirements 1.1, 2.1, 4.1**

### Property 2: Contrast Ratio Compliance

*For any* text element and its background color combination in both light and dark modes, the computed contrast ratio SHALL meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text ≥18px or bold ≥14px).

**Validates: Requirements 1.7, 3.8, 5.8, 7.5, 10.1**

### Property 3: Transition Timing Bounds

*For any* UI interaction transition (hover, focus, theme switch, collapse/expand), the transition-duration SHALL be between 150ms and 350ms, and the timing-function SHALL use ease-out or spring-based curves.

**Validates: Requirements 1.6, 2.5, 2.7, 4.6, 7.6, 9.2**

### Property 4: Dark Mode Token Consistency

*For any* design token that has both light and dark mode variants, the dark mode value SHALL differ appropriately (darker backgrounds, lighter text, adjusted opacity for glass effects, proportional shadow intensity).

**Validates: Requirements 1.8, 2.8, 7.3, 7.4, 7.7**

### Property 5: Reduced Motion Respect

*For any* animation or transition defined in the system, there SHALL exist a corresponding `@media (prefers-reduced-motion: reduce)` rule that disables or minimizes the animation.

**Validates: Requirements 6.7, 9.4, 10.7**

### Property 6: Glassmorphism Fallback Provision

*For any* component using backdrop-filter, there SHALL exist a `@supports not (backdrop-filter: blur(1px))` rule providing a solid background fallback.

**Validates: Requirements 7.8, 10.8**

### Property 7: Hover State Feedback

*For any* interactive element (cards, buttons, nav items), the hover state SHALL modify at least one of: box-shadow, transform, border-color, or background-color, without causing layout shift.

**Validates: Requirements 4.4, 4.5, 4.7, 5.7, 6.6**

### Property 8: Typography Stack Consistency

*For any* text element, the font-family SHALL match the design system specification: system font stack for body text, monospace stack for code elements.

**Validates: Requirements 3.1, 3.2, 5.3**

### Property 9: Spacing Token Usage

*For any* margin or padding value in component styles, the value SHALL reference a design token from the spacing scale (--vp-space-* or --space-*).

**Validates: Requirements 2.6, 3.6**

### Property 10: Responsive Layout Adaptation

*For any* viewport width at defined breakpoints (480px, 640px, 768px, 1024px, 1280px), the layout SHALL adapt appropriately without horizontal overflow, with adjusted spacing, font sizes, and component arrangements.

**Validates: Requirements 8.1, 8.4, 8.5, 8.6, 8.7, 8.8**

### Property 11: Focus Indicator Visibility

*For any* focusable element, the :focus-visible state SHALL display a visible outline (minimum 2px) with brand color and appropriate offset.

**Validates: Requirements 10.2, 10.5**

### Property 12: Keyboard Navigation Order

*For any* navigation sequence via Tab key, the focus order SHALL follow the visual reading order (left-to-right, top-to-bottom) without traps or skipped elements.

**Validates: Requirements 10.3**

### Property 13: Multi-State Indicators

*For any* state change (active, error, success), the visual indication SHALL include at least two distinct cues (e.g., color + border, color + icon) to avoid relying solely on color.

**Validates: Requirements 10.4**

### Property 14: Shadow Layer Structure

*For any* soft shadow in the design system, the box-shadow value SHALL contain at least two shadow layers with different blur radii and opacities for depth perception.

**Validates: Requirements 1.5, 4.2**

### Property 15: Border Radius Consistency

*For any* component with rounded corners, the border-radius SHALL reference a design token value (--vp-border-radius-* or --radius-*).

**Validates: Requirements 4.3, 5.2**

### Property 16: Animation Performance

*For any* animation, the animated properties SHALL be limited to transform and opacity for GPU acceleration, avoiding width, height, top, left, or margin animations.

**Validates: Requirements 9.5, 9.6**

## Error Handling

### CSS Fallback Strategy

```css
/* Glassmorphism fallback for unsupported browsers */
.glass-component {
  /* Fallback solid background */
  background: var(--vp-c-bg);
  
  /* Enhanced styles for supporting browsers */
  @supports (backdrop-filter: blur(1px)) {
    background: var(--vp-c-bg-glass);
    backdrop-filter: blur(var(--vp-blur-md));
    -webkit-backdrop-filter: blur(var(--vp-blur-md));
  }
}
```

### Theme Transition Error Prevention

```css
/* Prevent flash of unstyled content during theme switch */
html.theme-transitioning * {
  transition: none !important;
}

/* Re-enable after transition completes */
html:not(.theme-transitioning) * {
  transition: color var(--vp-animation-duration-normal),
              background-color var(--vp-animation-duration-normal),
              border-color var(--vp-animation-duration-normal);
}
```

### Responsive Breakpoint Safeguards

```css
/* Prevent horizontal overflow at any viewport */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

/* Container safety */
.container {
  width: 100%;
  max-width: min(var(--vp-layout-max-width), 100vw - 2rem);
  margin: 0 auto;
  padding: 0 1rem;
}
```

### Animation Error Boundaries

```css
/* Reduced motion fallback */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Contrast Ratio Safeguards

```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --vp-c-text-1: #000000;
    --vp-c-text-2: #1a1a1a;
    --vp-c-bg: #ffffff;
    --vp-c-border: #000000;
  }
  
  .dark {
    --vp-c-text-1: #ffffff;
    --vp-c-text-2: #e5e5e5;
    --vp-c-bg: #000000;
    --vp-c-border: #ffffff;
  }
}
```

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs using randomized testing

### Testing Framework

- **Unit Testing**: Vitest with Vue Test Utils
- **Property-Based Testing**: fast-check library for JavaScript/TypeScript
- **Visual Regression**: Playwright for screenshot comparison
- **Accessibility Testing**: axe-core for automated a11y checks

### Property-Based Test Configuration

Each property test will:
- Run minimum 100 iterations
- Use fast-check's arbitrary generators for CSS values
- Reference the design document property in comments

**Tag format**: `Feature: website-redesign-glassmorphism, Property {number}: {property_text}`

### Test Categories

#### 1. Design Token Tests

```typescript
// Feature: website-redesign-glassmorphism, Property 1: Glassmorphism Blur Consistency
describe('Glassmorphism Blur Values', () => {
  it.prop([fc.constantFrom('navbar', 'sidebar', 'card')])
  ('blur values are within specified ranges', (componentType) => {
    const blurRanges = {
      navbar: { min: 16, max: 24 },
      sidebar: { min: 8, max: 12 },
      card: { min: 12, max: 16 }
    };
    const computedBlur = getComputedBlur(componentType);
    const range = blurRanges[componentType];
    return computedBlur >= range.min && computedBlur <= range.max;
  });
});
```

#### 2. Contrast Ratio Tests

```typescript
// Feature: website-redesign-glassmorphism, Property 2: Contrast Ratio Compliance
describe('WCAG AA Contrast Compliance', () => {
  it.prop([fc.constantFrom('light', 'dark'), textElementArbitrary])
  ('all text meets contrast requirements', (mode, element) => {
    const { textColor, bgColor, fontSize, fontWeight } = getElementColors(element, mode);
    const ratio = calculateContrastRatio(textColor, bgColor);
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
    const minRatio = isLargeText ? 3 : 4.5;
    return ratio >= minRatio;
  });
});
```

#### 3. Transition Timing Tests

```typescript
// Feature: website-redesign-glassmorphism, Property 3: Transition Timing Bounds
describe('Transition Duration Bounds', () => {
  it.prop([transitionElementArbitrary])
  ('transitions are within 150-350ms', (element) => {
    const duration = getTransitionDuration(element);
    return duration >= 150 && duration <= 350;
  });
});
```

#### 4. Responsive Layout Tests

```typescript
// Feature: website-redesign-glassmorphism, Property 10: Responsive Layout Adaptation
describe('Responsive Layout', () => {
  it.prop([fc.constantFrom(480, 640, 768, 1024, 1280)])
  ('no horizontal overflow at breakpoints', async (viewport) => {
    await page.setViewportSize({ width: viewport, height: 800 });
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    return !hasOverflow;
  });
});
```

#### 5. Accessibility Tests

```typescript
// Feature: website-redesign-glassmorphism, Property 11: Focus Indicator Visibility
describe('Focus Indicators', () => {
  it.prop([focusableElementArbitrary])
  ('focus indicators are visible', async (selector) => {
    const element = await page.$(selector);
    await element.focus();
    const outline = await element.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        width: parseFloat(style.outlineWidth),
        color: style.outlineColor
      };
    });
    return outline.width >= 2 && outline.color !== 'transparent';
  });
});
```

### Unit Test Examples

```typescript
// Specific example tests for edge cases
describe('Code Block Styling', () => {
  it('displays brand accent border on top', () => {
    const codeBlock = mount(CodeBlock, { props: { language: 'javascript' } });
    expect(codeBlock.classes()).toContain('code-accent-border');
  });
  
  it('shows copy button on hover', async () => {
    const codeBlock = mount(CodeBlock);
    await codeBlock.trigger('mouseenter');
    expect(codeBlock.find('.copy-button').isVisible()).toBe(true);
  });
});

describe('Skip Link', () => {
  it('exists and is focusable', () => {
    const skipLink = document.querySelector('.skip-to-content');
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });
});
```

### Visual Regression Tests

```typescript
describe('Visual Regression', () => {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1440, height: 900, name: 'desktop' }
  ];
  
  for (const viewport of viewports) {
    it(`homepage matches snapshot at ${viewport.name}`, async () => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      expect(await page.screenshot()).toMatchSnapshot(`home-${viewport.name}.png`);
    });
  }
  
  it('dark mode matches snapshot', async () => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    expect(await page.screenshot()).toMatchSnapshot('home-dark.png');
  });
});
```

### Accessibility Audit

```typescript
describe('Accessibility Audit', () => {
  it('passes axe-core checks', async () => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });
  
  it('passes axe-core in dark mode', async () => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
```

## Implementation Notes

### CSS Custom Property Naming Convention

```
--vp-{category}-{property}[-{variant}]

Examples:
--vp-c-brand-1          (color, brand, variant 1)
--vp-shadow-hover       (shadow, hover state)
--vp-blur-md            (blur, medium size)
--vp-border-radius-card (border-radius, card component)
```

### Component CSS Module Pattern

```vue
<style module>
.navbar {
  background: var(--vp-c-bg-glass);
  backdrop-filter: blur(var(--vp-blur-lg));
  border: 1px solid var(--vp-c-border-glass);
  box-shadow: var(--vp-shadow-3);
  border-radius: var(--vp-border-radius-xl);
  transition: 
    background-color var(--vp-animation-duration-normal) var(--vp-animation-easing-expo-out),
    box-shadow var(--vp-animation-duration-normal) var(--vp-animation-easing-expo-out);
}
</style>
```

### Performance Considerations

1. **GPU Acceleration**: Use `transform: translateZ(0)` or `will-change` sparingly
2. **Backdrop Filter**: Limit to essential components (navbar, sidebar, modals)
3. **Animation Batching**: Group animations to reduce repaints
4. **CSS Containment**: Use `contain: layout style paint` for isolated components
