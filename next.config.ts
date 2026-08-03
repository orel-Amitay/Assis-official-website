import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/PrivacyPolicy",
        permanent: true,
      },
      {
        source: "/privacy-policy/",
        destination: "/PrivacyPolicy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
