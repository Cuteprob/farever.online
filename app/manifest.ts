import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.siteShortName,
    description: siteConfig.siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0d0f17",
    theme_color: siteConfig.siteThemeColor,
    orientation: "portrait-primary",
    categories: ["games", "entertainment", "reference"],
    lang: siteConfig.siteLocale,
    icons: [
      { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
