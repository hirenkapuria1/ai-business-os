/** @type {import('next').NextConfig} */
if (process.env.NODE_ENV === 'production') {
  const missing = ['DATABASE_URL', 'JWT_SECRET'].filter((key) => !process.env[key])
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) missing.push('JWT_SECRET (minimum 32 characters)')
  if (missing.length) throw new Error(`Missing or invalid production configuration: ${missing.join(', ')}`)
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig
