import { Metadata } from "next";
import { GuidePage } from "@/components/guide-page";
import { getGuidePage } from "@/data/guides";
import { siteConfig } from "@/lib/site-config";

export const runtime = 'edge';

const guide = getGuidePage("scritchy-scratchy-guide")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.metaDescription,
  alternates: {
    canonical: `${siteConfig.siteUrl}/${guide.slug}`,
  },
  openGraph: {
    title: guide.title,
    description: guide.metaDescription,
    type: "article",
    url: `${siteConfig.siteUrl}/${guide.slug}`,
    siteName: siteConfig.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: guide.title,
    description: guide.metaDescription,
  },
};

export default function ScritchyScratchyGuidePage() {
  return <GuidePage guide={guide} />;
}
