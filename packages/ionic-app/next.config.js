let nextConfig = {};

// const securityHeaders = [
//   {
//     key: 'Strict-Transport-Security',
//     value: 'max-age=63072000; includeSubDomains; preload',
//   },
//   // {
//   // 	key: "Content-Security-Policy",
//   // 	value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
//   // },
//   {
//     key: 'X-Content-Type-Options',
//     value: 'nosniff',
//   },
//   {
//     key: 'cache-control',
//     value: 'no-cache, no-store, max-age=0, must-revalidate',
//   },
//   {
//     key: 'X-XSS-Protection',
//     value: '1; mode=block',
//   },
// ];
// @ts-check
// const STUDIO_REWRITE = {
//   source: '/studio/:path*',
//   destination:
//     process.env.NODE_ENV === 'development'
//       ? 'http://localhost:3333/studio/:path*'
//       : '/studio/index.html',
// };

const glob = require('glob');
const files = glob.sync('../{colart/*}/package.json');
const modules = files.map(file => require(file).name);
const withTM = require('next-transpile-modules')(modules);
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: false, // process.env.NODE_ENV === 'development',
// });
const compose = require('next-compose-plugins');
/**
 * @type {import('next').NextConfig}
 **/
nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  // rewrites: () => [STUDIO_REWRITE],
  // eslint: {
  // 	dirs: ["pages", "features", "components", "lib", "styles"],
  // },
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  basePath: '',
  images: {
    domains: ['images.unsplash.com'],
  },
  swcMinify: true,
  transpilePackages: ['@ionic/react', '@ionic/core', '@stencil/core', 'ionicons'],
};
// if (process.env.NODE_ENV === 'production') {
//   nextConfig = {
//     ...nextConfig,
//     async headers() {
//       return [
//         {
//           source: '/:path*',
//           headers: securityHeaders,
//         },
//       ];
//     },
//   };
// }

// const tempDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || `development`;
// const tempEnv = tempDataset === 'develop' ? `development` : tempDataset;
// require('dotenv').config({
//   path: `./environments/.env.${tempEnv}`,
// });
// let env = {};
// Object.keys(process.env).forEach(key => {
//   env[key] = process.env[key];
// });
const environments = {
  env: {},
};
module.exports = compose([withTM], nextConfig, environments);

// module.exports = {};
