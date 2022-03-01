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
  swcMinify: true,
  optimizeFonts: true,
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/panel'
      }
    ]
  }
}

module.exports = withPlugins([[withBundleAnalyzer]], nextConfig)
