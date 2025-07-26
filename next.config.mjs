/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "dharmik.codes",
      },
      {
        protocol: "https",
        hostname: "dharmik.codes",
      },
    ],
  },
};

export default nextConfig;
