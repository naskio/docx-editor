import type { NextConfig } from 'next';
import { env } from '@/lib/env';

const nextConfig: NextConfig = {
  basePath: env.basePath, // base path for GitHub Pages
  output: env.output || undefined, // export => static site generation, undefined => Next.js default
  trailingSlash: true, // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  skipTrailingSlashRedirect: false, // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // reactStrictMode: true, // Since Next.js 13.5.1, Strict Mode is true by default with app router
  // distDir: 'out', // default
};

export default nextConfig;
