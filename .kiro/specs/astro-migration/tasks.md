# Implementation Plan: Astro Migration

## Overview

This implementation plan converts the VitePress-based Knowledge Wiki to Astro, preserving the glassmorphism theme and all existing features. Tasks are organized in phases that build incrementally, with property-based tests integrated close to implementation.

## Tasks

- [x] 1. Project Initialization and Configuration
  - [x] 1.1 Initialize Astro project with TypeScript
    - Run `npm create astro@latest astro-site -- --template minimal --typescript strict`
    - Configure `astro.config.mjs` with base path `/blogv2/` and SSG output
    - Set up TypeScript strict mode in `tsconfig.json`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Configure Tailwind CSS integration
    - Install `@astrojs/tailwind` and `tailwindcss`
    - Create `tailwind.config.mjs` with custom theme extending design tokens
    - Configure content paths for Tailwind purging
    - _Requirements: 1.4_

  - [x] 1.3 Set up design tokens and global styles
    - Create `src/styles/design-tokens.css` with CSS custom properties
    - Define color palette (Primary #5E5CE6, Secondary #7B7BF7)
    - Define glassmorphism variables (blur, opacity, saturation)
    - Define spacing scale, shadows, transitions, border radius
    - Create `src/styles/global.css` importing Tailwind and design tokens
    - _Requirements: 4.1, 4.5, 4.6_

  - [x] 1.4 Write property test for color contrast compliance
    - **Property 10: Color Contrast Compliance**
    - Test all text/background color pairs meet WCAG AA (4.5:1)
    - **Validates: Requirements 6.6**

- [x] 2. Content Collection Setup
  - [x] 2.1 Configure content collections with Zod schema
    - Create `src/content/config.ts` with docs collection
    - Define Zod schema for frontmatter (title, date, category, tags, description, layout)
    - Support optional fields with sensible defaults
    - _Requirements: 2.1, 2.2, 15.1_

  - [x] 2.2 Write property test for frontmatter validation
    - **Property 1: Frontmatter Schema Validation**
    - Test valid frontmatter is accepted, invalid types rejected
    - **Validates: Requirements 2.1, 15.1**

  - [x] 2.3 Write property test for frontmatter defaults
    - **Property 27: Frontmatter Default Values**
    - Test missing optional fields get sensible defaults
    - **Validates: Requirements 15.6**

  - [x] 2.4 Set up content symlink and folder structure
    - Create symlink from `src/content/docs/` to existing `docs/` content
    - Verify folder structure matches (algorithms, artificial-intelligence, etc.)
    - _Requirements: 2.5_

  - [x] 2.5 Configure MDX support
    - Install `@astrojs/mdx`
    - Configure MDX in `astro.config.mjs`
    - _Requirements: 2.3_

  - [x] 2.6 Configure Shiki syntax highlighting
    - Configure Shiki with github-light/github-dark themes
    - Enable line numbers by default
    - _Requirements: 2.4_

- [x] 3. Checkpoint - Verify content collection setup
  - Ensure content collection builds without errors
  - Verify frontmatter parsing works for sample files
  - Ask the user if questions arise

- [ ] 4. Dynamic Routing and URL Structure
  - [~] 4.1 Create dynamic route handler
    - Create `src/pages/[...slug].astro` for doc pages
    - Implement `getStaticPaths()` to generate routes from content collection
    - Match existing URL structure (e.g., `/algorithms/sorting/`)
    - _Requirements: 2.6_

  - [~] 4.2 Write property test for URL routing
    - **Property 2: Content URL Routing**
    - Test file paths generate correct URLs
    - **Validates: Requirements 2.6**

- [ ] 5. Base Layout Implementation
  - [~] 5.1 Create BaseLayout component
    - Create `src/layouts/BaseLayout.astro`
    - Implement HTML structure with proper lang attribute
    - Add meta tags slot for SEO
    - Add theme initialization script (prevent flash)
    - Import global styles
    - _Requirements: 12.1_

  - [~] 5.2 Implement SEO meta tags
    - Add title, description, canonical URL meta tags
    - Add Open Graph meta tags (og:title, og:description, og:url, og:type)
    - Add Twitter Card meta tags
    - _Requirements: 12.1, 12.2_

  - [~] 5.3 Write property test for meta tags
    - **Property 19: SEO Meta Tags**
    - Test all required meta tags are present
    - **Validates: Requirements 12.1, 12.2**

  - [~] 5.4 Add skip-to-content link
    - Add visually hidden skip link for keyboard users
    - Style with focus visibility
    - _Requirements: 12.5_

- [ ] 6. Navbar Component
  - [~] 6.1 Create floating glass navbar
    - Create `src/components/layout/Navbar.astro`
    - Implement glassmorphism styling (blur 20px, opacity 0.75/0.85)
    - Add floating positioning (top: 12px, left/right: 16px)
    - Add rounded corners (16px) and multi-layered shadows
    - _Requirements: 4.2, 5.1_

  - [~] 6.2 Implement navbar content
    - Add site logo with link to home
    - Add navigation links with dropdown support
    - Add search button trigger
    - Add theme toggle placeholder
    - Add social links (GitHub)
    - _Requirements: 5.1_

  - [~] 6.3 Implement dark mode navbar styles
    - Adjust glass opacity for dark mode (0.85)
    - Update border colors for visibility
    - Maintain consistent shadow ratios
    - _Requirements: 4.2_

  - [~] 6.4 Add glassmorphism fallback
    - Add @supports fallback for browsers without backdrop-filter
    - Use solid background with high opacity
    - _Requirements: 4.7_

- [ ] 7. Theme Toggle Component
  - [~] 7.1 Create theme toggle component
    - Create `src/components/ui/ThemeToggle.astro`
    - Implement sun/moon icon toggle
    - Add smooth icon transition animation
    - _Requirements: 6.2_

  - [~] 7.2 Implement theme logic
    - Detect system preference on initial load
    - Persist preference to localStorage
    - Apply theme class to document root
    - Prevent flash of incorrect theme with inline script
    - _Requirements: 6.1, 6.3, 6.4_

  - [~] 7.3 Write property test for theme persistence
    - **Property 9: Theme Persistence Round-Trip**
    - Test theme value persists correctly to localStorage
    - **Validates: Requirements 6.3**

  - [~] 7.4 Define light/dark mode design tokens
    - Create separate token values for light and dark modes
    - Use CSS custom properties with .dark class override
    - _Requirements: 6.5_

- [~] 8. Checkpoint - Verify layout and theme
  - Ensure navbar displays correctly in both themes
  - Verify theme toggle persists preference
  - Test glassmorphism effect and fallback
  - Ask the user if questions arise

- [ ] 9. Sidebar Component
  - [~] 9.1 Create sidebar generator utility
    - Create `src/lib/sidebar.ts`
    - Implement function to scan content folder structure
    - Build hierarchical navigation from folders
    - Sort by frontmatter order or alphabetically
    - _Requirements: 5.3_

  - [~] 9.2 Write property test for sidebar generation
    - **Property 6: Sidebar Generation from Folder Structure**
    - Test folder hierarchy produces correct navigation structure
    - **Validates: Requirements 5.3**

  - [~] 9.3 Create sidebar component
    - Create `src/components/layout/Sidebar.astro`
    - Implement glass styling (blur 12px)
    - Display hierarchical navigation items
    - _Requirements: 4.3, 5.4_

  - [~] 9.4 Implement collapsible sections
    - Add expand/collapse functionality with 250ms animation
    - Persist collapse state in localStorage
    - Add caret rotation indicator
    - _Requirements: 5.4_

  - [~] 9.5 Implement active state styling
    - Add 3px brand-colored left border for active item
    - Apply soft brand background highlight
    - _Requirements: 5.5_

  - [~] 9.6 Write property test for sidebar active state
    - **Property 7: Sidebar Active State**
    - Test correct item has active class for given path
    - **Validates: Requirements 5.5**

  - [~] 9.7 Implement sidebar text from frontmatter
    - Use frontmatter title as display text
    - Fall back to first heading if no title
    - _Requirements: 5.7_

  - [~] 9.8 Write property test for sidebar text source
    - **Property 8: Sidebar Text from Frontmatter**
    - Test sidebar text matches frontmatter title or first heading
    - **Validates: Requirements 5.7**

- [ ] 10. Mobile Navigation
  - [~] 10.1 Create mobile menu component
    - Create `src/components/layout/MobileMenu.astro`
    - Implement hamburger button
    - Create slide-out overlay menu
    - _Requirements: 5.6_

  - [~] 10.2 Implement responsive breakpoints
    - Hide sidebar on viewport < 768px
    - Show hamburger menu on mobile
    - Reduce navbar edge margins to 8px on mobile
    - _Requirements: 10.2, 10.3_

- [ ] 11. Doc Layout Implementation
  - [~] 11.1 Create DocLayout component
    - Create `src/layouts/DocLayout.astro`
    - Extend BaseLayout with navbar, sidebar, content area
    - Add proper spacing for floating navbar
    - _Requirements: 5.1_

  - [~] 11.2 Implement article metadata display
    - Create `src/components/content/ArticleMeta.astro`
    - Display title, date, category, tags
    - Calculate and display word count and reading time
    - _Requirements: 9.1, 9.2_

  - [~] 11.3 Write property test for document metadata
    - **Property 16: Document Metadata Display**
    - Test all metadata fields are displayed correctly
    - **Validates: Requirements 9.1, 9.2**

  - [~] 11.4 Add edit on GitHub link
    - Generate correct GitHub edit URL from file path
    - Display edit link in article footer
    - _Requirements: 9.4_

  - [~] 11.5 Write property test for edit link generation
    - **Property 17: Edit Link URL Generation**
    - Test edit URLs are generated correctly from file paths
    - **Validates: Requirements 9.4**

  - [~] 11.6 Add last updated display
    - Display last updated timestamp from frontmatter
    - Format date appropriately
    - _Requirements: 9.3_

- [~] 12. Checkpoint - Verify doc layout
  - Ensure doc pages render with correct layout
  - Verify sidebar navigation works
  - Test mobile responsive behavior
  - Ask the user if questions arise

- [ ] 13. Code Block Component
  - [~] 13.1 Create enhanced code block component
    - Create `src/components/content/CodeBlock.astro`
    - Integrate Shiki syntax highlighting
    - Display line numbers
    - Display language label
    - _Requirements: 13.1, 13.4_

  - [~] 13.2 Write property test for code block rendering
    - **Property 3: Code Block Rendering**
    - Test code blocks have highlighting, line numbers, and language label
    - **Validates: Requirements 2.4, 13.1, 13.4**

  - [~] 13.3 Add copy-to-clipboard button
    - Implement copy button with clipboard API
    - Show confirmation feedback on copy
    - _Requirements: 13.2_

- [ ] 14. Mermaid Diagram Component
  - [~] 14.1 Create Mermaid renderer
    - Create `src/components/content/MermaidDiagram.astro`
    - Install and configure mermaid package
    - Render diagrams to SVG at build time
    - _Requirements: 3.1, 3.2_

  - [~] 14.2 Write property test for Mermaid rendering
    - **Property 4: Mermaid Diagram Rendering**
    - Test valid mermaid code produces SVG output
    - **Validates: Requirements 3.1**

  - [~] 14.3 Implement Mermaid error handling
    - Display source code on render failure
    - Show error message to user
    - _Requirements: 3.5_

  - [~] 14.4 Write property test for Mermaid error handling
    - **Property 5: Mermaid Error Handling**
    - Test invalid mermaid code shows source and error
    - **Validates: Requirements 3.5**

  - [~] 14.5 Create Mermaid modal for zoom
    - Create `src/components/interactive/MermaidModal.tsx`
    - Implement click-to-zoom functionality
    - Use client:visible directive for hydration
    - _Requirements: 3.3_

- [ ] 15. Markdown Extensions
  - [~] 15.1 Implement highlight syntax support
    - Add remark plugin for ==highlight== syntax
    - Render as `<mark>` element
    - _Requirements: 15.2_

  - [~] 15.2 Write property test for highlight syntax
    - **Property 23: Markdown Highlight Syntax**
    - Test ==text== renders as `<mark>` element
    - **Validates: Requirements 15.2**

  - [~] 15.3 Implement image size syntax
    - Add remark plugin for image size syntax
    - Support `![alt](url =WxH)` format
    - _Requirements: 15.3_

  - [~] 15.4 Write property test for image size syntax
    - **Property 24: Image Size Syntax**
    - Test image size syntax produces correct dimensions
    - **Validates: Requirements 15.3**

  - [~] 15.5 Configure relative image path handling
    - Ensure relative paths resolve correctly
    - Handle images in same directory as markdown
    - _Requirements: 15.4_

  - [~] 15.6 Write property test for relative image paths
    - **Property 25: Relative Image Path Resolution**
    - Test relative paths resolve to correct URLs
    - **Validates: Requirements 15.4**

  - [~] 15.7 Configure math equation support
    - Install remark-math and rehype-katex
    - Support inline ($...$) and block ($$...$$) math
    - _Requirements: 15.5_

  - [~] 15.8 Write property test for math equations
    - **Property 26: Math Equation Rendering**
    - Test math syntax renders correctly
    - **Validates: Requirements 15.5**

- [~] 16. Checkpoint - Verify content rendering
  - Ensure code blocks render with all features
  - Verify Mermaid diagrams render correctly
  - Test markdown extensions (highlight, image size, math)
  - Ask the user if questions arise

- [ ] 17. Search Implementation
  - [~] 17.1 Integrate Pagefind
    - Install `@pagefind/default-ui`
    - Configure Pagefind in build process
    - Generate search index at build time
    - _Requirements: 7.1_

  - [~] 17.2 Create search modal component
    - Create `src/components/interactive/SearchModal.tsx`
    - Implement modal UI with search input
    - Display results with title, excerpt, category
    - Highlight matching terms
    - _Requirements: 7.2, 7.3, 7.6_

  - [~] 17.3 Write property test for search results
    - **Property 11: Search Results Content**
    - Test results contain required fields with highlighting
    - **Validates: Requirements 7.3, 7.6**

  - [~] 17.4 Implement keyboard navigation
    - Support arrow keys for result navigation
    - Support Enter to select, Escape to close
    - _Requirements: 7.4_

  - [~] 17.5 Handle empty results
    - Display helpful message when no results found
    - _Requirements: 7.5_

- [ ] 18. Timeline Feature
  - [~] 18.1 Create timeline page
    - Create `src/pages/timeline.astro`
    - Query all articles from content collection
    - Sort by date descending
    - _Requirements: 8.1_

  - [~] 18.2 Write property test for timeline sorting
    - **Property 12: Timeline Chronological Sorting**
    - Test articles are sorted newest first
    - **Validates: Requirements 8.1**

  - [~] 18.3 Implement year-month grouping
    - Group articles by year and month
    - Display group headers
    - _Requirements: 8.2_

  - [~] 18.4 Write property test for timeline grouping
    - **Property 13: Timeline Year-Month Grouping**
    - Test articles are grouped correctly by year/month
    - **Validates: Requirements 8.2**

  - [~] 18.5 Create timeline entry component
    - Display title, date, category, excerpt
    - Link to full article
    - _Requirements: 8.3, 8.5_

  - [~] 18.6 Write property test for timeline entry content
    - **Property 14: Timeline Entry Content**
    - Test entries contain all required fields
    - **Validates: Requirements 8.3**

  - [~] 18.7 Implement category filtering
    - Add filter UI for categories
    - Filter displayed articles by selection
    - _Requirements: 8.4_

  - [~] 18.8 Write property test for timeline filtering
    - **Property 15: Timeline Category Filtering**
    - Test filtering shows only matching articles
    - **Validates: Requirements 8.4**

- [ ] 19. Homepage Implementation
  - [~] 19.1 Create homepage
    - Create `src/pages/index.astro`
    - Implement hero section with title and tagline
    - Add feature cards for main sections
    - _Requirements: N/A (existing feature)_

  - [~] 19.2 Create HomeLayout
    - Create `src/layouts/HomeLayout.astro`
    - Extend BaseLayout without sidebar
    - _Requirements: N/A_

- [~] 20. Checkpoint - Verify features
  - Ensure search works correctly
  - Verify timeline displays and filters
  - Test homepage renders correctly
  - Ask the user if questions arise

- [ ] 21. Image Optimization
  - [~] 21.1 Configure Astro Image
    - Enable image optimization in astro.config.mjs
    - Configure image formats and quality
    - _Requirements: 11.2_

  - [~] 21.2 Implement lazy loading
    - Add loading="lazy" to images below fold
    - Keep above-fold images eager
    - _Requirements: 11.4_

  - [~] 21.3 Write property test for lazy loading
    - **Property 18: Image Lazy Loading**
    - Test images have loading="lazy" attribute
    - **Validates: Requirements 11.4**

  - [~] 21.4 Ensure image alt text
    - Validate all images have alt attributes
    - Add default alt text handling
    - _Requirements: 12.6_

  - [~] 21.5 Write property test for image alt text
    - **Property 21: Image Alt Text**
    - Test all images have non-empty alt attribute
    - **Validates: Requirements 12.6**

- [ ] 22. Accessibility Enhancements
  - [~] 22.1 Verify heading hierarchy
    - Ensure single h1 per page
    - Maintain proper heading order
    - _Requirements: 12.4_

  - [~] 22.2 Write property test for heading hierarchy
    - **Property 20: Single H1 Per Page**
    - Test each page has exactly one h1
    - **Validates: Requirements 12.4**

  - [~] 22.3 Add reduced motion support
    - Add @media (prefers-reduced-motion) CSS rules
    - Disable animations for users who prefer reduced motion
    - _Requirements: 12.7_

- [ ] 23. Performance Optimization
  - [~] 23.1 Configure link prefetching
    - Enable Astro prefetch for internal links
    - Configure prefetch strategy
    - _Requirements: 11.3_

  - [~] 23.2 Verify minimal JavaScript
    - Ensure pages have zero JS by default
    - Only hydrate interactive islands
    - _Requirements: 11.1_

- [ ] 24. Deployment Configuration
  - [~] 24.1 Create GitHub Actions workflow
    - Create `.github/workflows/deploy.yml`
    - Configure build and deploy to GitHub Pages
    - Trigger on push to main branch
    - _Requirements: 14.1, 14.2_

  - [~] 24.2 Verify base path configuration
    - Ensure all links include `/blogv2/` prefix
    - Test asset paths are correct
    - _Requirements: 14.3_

  - [~] 24.3 Write property test for base path
    - **Property 22: Base Path in Links**
    - Test all internal links have correct base path
    - **Validates: Requirements 14.3**

  - [~] 24.4 Create 404 page
    - Create `src/pages/404.astro`
    - Add navigation back to home
    - Style consistently with site theme
    - _Requirements: 14.4_

  - [~] 24.5 Generate sitemap
    - Install `@astrojs/sitemap`
    - Configure sitemap generation
    - _Requirements: 12.3_

- [~] 25. Final Checkpoint - Complete verification
  - Run full build and verify no errors
  - Test all pages render correctly
  - Verify all property tests pass
  - Test deployment workflow
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests use fast-check library with minimum 100 iterations
- Interactive components (search modal, mermaid modal) use React with client:visible hydration
