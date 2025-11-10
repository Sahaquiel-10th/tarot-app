// next.config.mjs
console.log('>>> next.config.mjs loaded: basePath=/tarot')

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  turbopack: { root: '.' },

  // 关键：站点挂在 /tarot
  basePath: '/tarot',
}

export default nextConfig