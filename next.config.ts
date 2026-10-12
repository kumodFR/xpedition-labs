import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // The homepage is the plain HTML site in public/xpedition-labs.html
      // (it runs its own scripts, so it is served as-is instead of through React).
      beforeFiles: [{ source: "/", destination: "/xpedition-labs.html" }],
    };
  },
};

export default nextConfig;
