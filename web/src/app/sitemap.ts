import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://yokla.com.tr/", changeFrequency: "weekly", priority: 1 }];
}
