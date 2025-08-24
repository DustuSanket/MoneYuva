/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    disableOptimizedLoading: true,
    disableRSC: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
