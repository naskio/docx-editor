import type { NextConfig } from 'next';
import { env } from '@/lib/env';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Since Next.js 13.5.1, Strict Mode is true by default with app router
  basePath: env.basePath, // base path for GitHub Pages
  output: 'export', // static site generation
  trailingSlash: true, // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  skipTrailingSlashRedirect: false, // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  distDir: 'out', // default
};

export default nextConfig;
