import { Metadata } from "next";
import { GuidePage } from "@/components/guide-page";
import { getGuidePage } from "@/data/guides";
import { siteConfig } from "@/lib/site-config";
import { notFound } from "next/navigation";

const guide = getGuidePage("weapons-guide");

export const metadata: Metadata = guide ? {
  title: guide.title,
  description: guide.metaDescription,
  alternates: { canonical: `${siteConfig.siteUrl}/weapons-guide` },
  openGraph: {
    title: guide.title,
    description: guide.metaDescription,
    url: `${siteConfig.siteUrl}/weapons-guide`,
    siteName: siteConfig.siteName,
    type: "article",
    images: [{ url: siteConfig.defaultOgImage, width: 1200, height: 675, alt: "Official Farever gameplay screenshot" }],
  },
  twitter: { card: "summary_large_image", images: [siteConfig.defaultOgImage] },
} : {};

export default function WeaponsGuidePage() {
  if (!guide) return notFound();
  return <GuidePage guide={guide} />;
}
