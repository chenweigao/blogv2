// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import { remarkRelativeImages } from './src/lib/remark-relative-images.ts';
import { remarkCallouts } from './src/lib/remark-callouts.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://username.github.io',
  base: '/',
  output: 'static',
  build: {
    format: 'directory',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
    remarkPlugins: [remarkMath, remarkDirective, remarkCallouts, remarkRelativeImages],
    rehypePlugins: [rehypeKatex],
  },
  image: {
    // Allow images from content directory
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        // Externalize pagefind since it's generated post-build
        external: [/^\/pagefind\//],
      },
    },
  },
});
