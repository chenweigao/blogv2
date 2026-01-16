import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Docs Collection Schema
 * Validates: Requirements 2.1, 2.2, 15.1
 */
const docsCollection = defineCollection({
  loader: glob({ 
    pattern: '**/*.md', 
    base: './src/content/docs',
    // Disable automatic image processing for relative paths
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    // Required fields with defaults
    title: z.string().optional(),
    
    // Optional metadata
    date: z.coerce.date().optional(),
    category: z.union([z.string(), z.array(z.string())]).optional(),
    tags: z.array(z.string()).optional().default([]),
    tag: z.union([z.string(), z.array(z.string())]).optional(), // VuePress/VitePress compatibility
    description: z.string().optional(),
    
    // Layout control (VitePress compatibility)
    layout: z.string().optional(),
    
    // VitePress hero section (for home pages)
    hero: z.object({
      name: z.string().optional(),
      text: z.string().optional(),
      tagline: z.string().optional(),
      image: z.object({
        src: z.string(),
        alt: z.string(),
      }).optional(),
      actions: z.array(z.object({
        theme: z.string(),
        text: z.string(),
        link: z.string(),
      })).optional(),
    }).optional(),
    
    // VitePress features (for home pages)
    features: z.array(z.object({
      icon: z.string().optional(),
      title: z.string(),
      details: z.string(),
      link: z.string().optional(),
    })).optional(),
    
    // Sidebar order
    order: z.number().optional(),
    
    // Last updated timestamp
    lastUpdated: z.coerce.date().optional(),
  }),
});

export const collections = {
  docs: docsCollection,
};
