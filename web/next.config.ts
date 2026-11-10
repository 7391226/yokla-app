import { existsSync } from "node:fs";
import type { NextConfig } from "next";

// Asıl senaryo listesi (senaryolar/ozel.ts) gizlidir; açık kaynak depoda yoktur.
// Dosya yoksa örnek liste kullanılır, böylece depo herkeste derlenir.
const OZEL_SENARYOLAR = "./src/lib/yokla/senaryolar/ozel.ts";
const senaryolar = existsSync(OZEL_SENARYOLAR) ? OZEL_SENARYOLAR : "./src/lib/yokla/senaryolar/ornek.ts";
if (process.env.NODE_ENV === "production") {
  console.log(`Yokla senaryoları: ${senaryolar === OZEL_SENARYOLAR ? "asıl liste" : "ÖRNEK liste"}`);
}

const nextConfig: NextConfig = {
  // Sunucuya node_modules kurmadan gönderilebilen tek klasör (.next/standalone) üretir
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    resolveAlias: {
      "@yokla/senaryolar": senaryolar,
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
