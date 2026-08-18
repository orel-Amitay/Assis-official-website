import type { NextConfig } from "next";
import path from "path";

const infoSite = process.env.CONSUMER_INFO_SITE === "1";

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
      ...(infoSite
        ? [
            {
              source: "/",
              destination: "/info/mra-il",
              permanent: false,
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
