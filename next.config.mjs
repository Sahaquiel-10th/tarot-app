const basePath = '/tarot'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: { root: '.' },
}
export default nextConfig
