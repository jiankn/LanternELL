/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: [
      '@libsql/client',
      '@cloudflare/puppeteer',
    ],
    optimizePackageImports: [
      'lucide-react',
      '@heroicons/react',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig

