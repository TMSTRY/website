/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },   // YouTube thumbnails
      { protocol: "https", hostname: "cdn.sanity.io" },  // Sanity CMS images
    ],
  },
};

export default nextConfig;
