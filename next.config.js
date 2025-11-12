// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  // 让站点挂在 /tarot
  basePath: '/tarot',
  // 推荐加上，静态导出会生成 /tarot/index.html
  trailingSlash: true,

  // 静态导出
  output: 'export',

  // 导出时禁用 next/image 的优化（否则会报错）
  images: { unoptimized: true },

  // 在客户端可读的前缀，代码里统一用它来拼路径
  env: {
    NEXT_PUBLIC_BASE_PATH: '/tarot',
  },
};