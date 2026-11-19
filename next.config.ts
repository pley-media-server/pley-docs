import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static files in out/, indexed by Pagefind and served at pley.media/docs by Cloudflare (wrangler.jsonc).
  output: "export",
  basePath: "/docs",
  // features/index.html, not features.html, so pages and search results share /docs/features/.
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
