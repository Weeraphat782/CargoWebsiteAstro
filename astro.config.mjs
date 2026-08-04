// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { loadCmsLastmodMap } from './scripts/sitemap-lastmod.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

// ponytail: CMS lastmod only — static pages omitted so Google trusts the signal
const cmsLastmod = await loadCmsLastmodMap({
  supabaseUrl: env.PUBLIC_SUPABASE_URL,
  supabaseKey: env.PUBLIC_SUPABASE_ANON_KEY,
});

// https://astro.build/config — static SSG for S3 + CloudFront (ponytail: no adapter)
export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  site: env.PUBLIC_SITE_URL || 'https://web.omgexp.com',
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const lastmod = cmsLastmod.get(path);
        if (lastmod) item.lastmod = new Date(`${lastmod}T00:00:00.000Z`);
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
  },
});
