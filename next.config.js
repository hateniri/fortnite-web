/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages用の設定
  basePath: process.env.NODE_ENV === 'production' ? '/fortnite-web' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fortnite-web' : '',
}

module.exports = nextConfig