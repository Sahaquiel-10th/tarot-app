/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // ✅ 新增：启用 app 目录支持（确保 EdgeOne 能识别 /app/api 路由）
  experimental: {
    appDir: true,
  },
}

export default nextConfig