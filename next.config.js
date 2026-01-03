/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,

  // Image optimization
  images: {
    domains: ['ctwwshrswkomxfxhoqdx.supabase.co'],
  },

  // Custom headers for PWA
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
