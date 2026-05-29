import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "..", ".."),
  },
  async rewrites() {
    return [
      {
        source: "/docs.mdx",
        destination: "/llms.mdx/docs",
      },
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
