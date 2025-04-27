// let nextConfig = {};

// const glob = require("glob");
// const files = glob.sync("../{colart/*}/package.json");
// const modules = files.map((file) => require(file).name);
// const withTM = require("next-transpile-modules")(modules);
// const compose = require("next-compose-plugins");
// /**
//  * @type {import('next').NextConfig}
//  **/
// nextConfig = {
//   swcMinify: true,
//   reactStrictMode: true,
//   webpack5: true,
//   webpack: (config) => {
//     config.resolve.fallback = { fs: false };

//     return config;
//   },
//   basePath: "",
//   images: {
//     domains: ["images.unsplash.com"],
//   },
//   swcMinify: true,
// };

// const environments = {
//   env: {},
// };
// module.exports = compose([withTM], nextConfig, environments);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["../colart/"],
  images: {
    domains: [
      "www.yoursilvergenie.com",
      "cdn.dribbble.com",
      "png2.cleanpng.com",
    ],
  },
};

module.exports = nextConfig;
