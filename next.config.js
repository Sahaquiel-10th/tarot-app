// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 让站点挂到 /tarot
  basePath: '/tarot',
  // 建议加上：导出时会生成 /tarot/index.html
  trailingSlash: true,

  // 静态导出
  output: 'export',

  // 导出阶段禁用 next/image 的优化（不然会报错）
  images: { unoptimized: true },

  // 给前端读到的前缀（你的 fetch 代码会用到）
  env: { NEXT_PUBLIC_BASE_PATH: '/tarot' },
};

console.log('>>> next.config.js loaded', nextConfig);
module.exports = nextConfig;
