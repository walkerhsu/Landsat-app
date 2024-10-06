/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
    domains: ['img.clerk.com']
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*"
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/docs"
            : "/api/py/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/py/openapi.json"
            : "/api/py/openapi.json",
      },
    ];
  },
};

export default nextConfig;
