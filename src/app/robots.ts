import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      allow: ["/api/og"],
      disallow: ["/api/", "/settings"],
    },
    sitemap: "https://my-oshi.com/sitemap.xml",
  };
}
