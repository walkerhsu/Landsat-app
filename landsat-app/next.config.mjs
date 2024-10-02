/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts'],
  webpack: (config) => {
    config.module.rules.push({
      test: /mapbox-gl.js$/,
      use: ['babel-loader'],
    });
    return config;
  },
};

export default nextConfig;
