/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/tarot',
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  turbopack: { root: '.' },
}
export default nextConfig