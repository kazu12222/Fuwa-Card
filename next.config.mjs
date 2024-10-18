/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "mind-ar": "mind-ar/dist/mindar-image.prod.js",
    };
    return config;
  },
};

export default nextConfig;
