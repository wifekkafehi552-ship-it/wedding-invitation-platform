/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // add your Supabase Storage project domain after deployment, e.g.:
      // { protocol: "https", hostname: "xxxxx.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;
