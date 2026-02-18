import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/500/500",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/erfan/**",
        port: "",
      },
    ],
  },
};

export default nextConfig;
