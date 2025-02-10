import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: process.env.BASE_PATH || '', // base path for GitHub Pages
  output: 'export', // static site generation
  trailingSlash: true, // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  skipTrailingSlashRedirect: false, // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  distDir: 'out', // default
  serverRuntimeConfig: {
    // Will only be available on the server side
    basePath: process.env.BASE_PATH || '',
    repositoryUrl: `https://github.com/naskio/docx-editor`,
  },
};

export default nextConfig;
