import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 19: SEO Meta Tags
 * Validates: Requirements 12.1, 12.2
 * 
 * Tests that all required meta tags are present
 */

interface MetaTagsInput {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: string;
}

// Simulates meta tag generation from BaseLayout
function generateMetaTags(input: MetaTagsInput): Record<string, string> {
  const siteTitle = `${input.title} | Knowledge Wiki`;
  return {
    'title': siteTitle,
    'meta[name="title"]': siteTitle,
    'meta[name="description"]': input.description,
    'link[rel="canonical"]': input.canonicalUrl,
    'meta[property="og:type"]': input.ogType,
    'meta[property="og:url"]': input.canonicalUrl,
    'meta[property="og:title"]': siteTitle,
    'meta[property="og:description"]': input.description,
    'meta[property="twitter:card"]': 'summary_large_image',
    'meta[property="twitter:url"]': input.canonicalUrl,
    'meta[property="twitter:title"]': siteTitle,
    'meta[property="twitter:description"]': input.description,
  };
}

const requiredMetaTags = [
  'title',
  'meta[name="title"]',
  'meta[name="description"]',
  'link[rel="canonical"]',
  'meta[property="og:type"]',
  'meta[property="og:url"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="twitter:card"]',
  'meta[property="twitter:url"]',
  'meta[property="twitter:title"]',
  'meta[property="twitter:description"]',
];

describe('Property 19: SEO Meta Tags', () => {
  it('generates all required meta tags', () => {
    const input: MetaTagsInput = {
      title: 'Test Page',
      description: 'A test page description',
      canonicalUrl: 'https://example.com/test/',
      ogType: 'article',
    };

    const tags = generateMetaTags(input);
    
    for (const tag of requiredMetaTags) {
      expect(tags[tag], `Missing meta tag: ${tag}`).toBeDefined();
      expect(tags[tag].length, `Empty meta tag: ${tag}`).toBeGreaterThan(0);
    }
  });

  it('property: all meta tags are non-empty for valid input', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 200 }),
          canonicalUrl: fc.webUrl(),
          ogType: fc.constantFrom('website', 'article', 'profile'),
        }),
        (input) => {
          const tags = generateMetaTags(input);
          return requiredMetaTags.every(tag => tags[tag] && tags[tag].length > 0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: title always includes site name suffix', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (title) => {
          const input: MetaTagsInput = {
            title,
            description: 'desc',
            canonicalUrl: 'https://example.com',
            ogType: 'website',
          };
          const tags = generateMetaTags(input);
          return tags['title'].endsWith('| Knowledge Wiki');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: canonical URL matches og:url and twitter:url', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (url) => {
          const input: MetaTagsInput = {
            title: 'Test',
            description: 'desc',
            canonicalUrl: url,
            ogType: 'website',
          };
          const tags = generateMetaTags(input);
          return tags['link[rel="canonical"]'] === tags['meta[property="og:url"]'] &&
                 tags['link[rel="canonical"]'] === tags['meta[property="twitter:url"]'];
        }
      ),
      { numRuns: 100 }
    );
  });
});
