import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/games", "/games/*", "/privacy", "/terms", "/sitemap.xml", "/robots.txt"],
        disallow: ["/api/", "/iframe/", "/*iframe*", "/external/", "/*game-embed*", "/*embed*"],
        crawlDelay: 1,
      },
    ],
    sitemap: siteConfig.siteUrl ? [`${siteConfig.siteUrl}/sitemap.xml`] : [],
  };
}
