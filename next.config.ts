import type { NextConfig } from "next";

// Autorise l'intégration en iframe depuis le site vitrine ijhtransport.com
// (adapter la liste de domaines si un sous-domaine différent est utilisé).
const FRAME_ANCESTORS = [
  "'self'",
  "https://ijhtransport.com",
  "https://www.ijhtransport.com",
].join(" ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${FRAME_ANCESTORS};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
