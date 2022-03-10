// @ts-check

const withPlugins = require('next-compose-plugins')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  optimizeFonts: true,
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/panel'
      }
    ]
  },
  webpack(config, options) {
    config.optimization.minimize = false
    return config
  },
  assetPrefix: './' // Fixes HTTP 400 when fetching
}

module.exports = withPlugins([[withBundleAnalyzer]], nextConfig)
