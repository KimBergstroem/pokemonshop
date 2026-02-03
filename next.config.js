/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Enable Next.js Image Optimization for better performance
    // Automatically converts images to WebP/AVIF and generates responsive sizes
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // Cache optimized images for 1 year (better performance)
    remotePatterns: [
      // Pokemon card image sources
      {
        protocol: 'https',
        hostname: 'pokemoncardimages.pokedata.io',
      },
      {
        protocol: 'https',
        hostname: 'dz3we2x72f7ol.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'images.pokemoncard.io',
      },
      {
        protocol: 'https',
        hostname: 'assets.pokemon.com',
      },
      // Google services (Blogger, Googleusercontent)
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // TCG Player
      {
        protocol: 'https',
        hostname: 'tcgplayer-cdn.tcgplayer.com',
      },
      // WordPress sites
      {
        protocol: 'https',
        hostname: 'sixprizes.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      // Social media
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.redd.it',
      },
      // CDN services
      {
        protocol: 'https',
        hostname: 'cdn.abacus.ai',
      },
      {
        protocol: 'https',
        hostname: 'images2.minutemediacdn.com',
      },
      // YouTube thumbnails
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      // eBay images
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
      },
      // App static assets (emblems, logos, etc.)
      {
        protocol: 'https',
        hostname: 'd3gp36gzzqygor.cloudfront.net',
      },
    ],
  },
};

module.exports = nextConfig;
