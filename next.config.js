// next.config.js
console.log('>>> Loading next.config.js (basePath=/tarot)')

/** @type {import('next').NextConfig} */
module.exports = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  turbopack: { root: '.' },
  basePath: '/tarot',
}