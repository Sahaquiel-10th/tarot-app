// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ① 跑在子路径 /tarot
  basePath: '/tarot',
  trailingSlash: true,

  // ② 静态导出
  output: 'export',

  // ③ 关键：资源固定用根路径 /_next，避免 /tarot/_next 404
  assetPrefix: '',

  // ④ 导出时禁用 next/image 优化
  images: { unoptimized: true },

  // ⑤ 前端可用的前缀（你代码里有用到）
  env: { NEXT_PUBLIC_BASE_PATH: '/tarot' },
};

console.log('>>> next.config.js loaded', nextConfig);
module.exports = nextConfig;
