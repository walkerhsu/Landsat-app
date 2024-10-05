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
  images: {
    domains: ['img.clerk.com'], // Add the external domain here
  },
};

export default nextConfig;
