/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'Joe-Printer-HT-HF-350'; // GitHub repository name (for project pages)

const nextConfig = {
  // Output a fully static site for GitHub Pages
  output: 'export',
  // Silence monorepo root inference warnings
  outputFileTracingRoot: process.cwd(),
  // Expose basePath to the client/server runtime for prefixing public asset URLs
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repo}` : ''
  },
  // Serve from /<repo> when deployed to GitHub Pages project site
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : undefined,
  trailingSlash: true,
  images: {
    // Required for static export
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  }
};

export default nextConfig;
