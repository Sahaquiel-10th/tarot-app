// next.config.js
console.log('>>> Loading next.config.js (NO basePath)')

/** @type {import('next').NextConfig} */
module.exports = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  turbopack: { root: '.' },
  // 不要 basePath，让应用跑在根路径 /
}