import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: "i.imgur.com"
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'kjkhospital.com',
      },
      {
        protocol: 'https',
        hostname: 'geneticclinic.com.au',
      },
      {
        protocol: 'https',
        hostname: 'coral-worrying-turtle-782.mypinata.cloud',
      },
    ],
  },
};

export default nextConfig;
