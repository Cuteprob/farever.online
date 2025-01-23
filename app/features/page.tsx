import { Features } from "@/components/features";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <Breadcrumb 
          items={[
            { label: "Play Sprunksters", href: "/" },
            { label: "Features", href: "/features" }
          ]} 
        />
        <div className="space-y-16 mt-4">
          <Features />
          {/* <RelatedGames /> */}
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: "Discover Sprunksters Features - Sprunksters",
  description: "Discover Sprunksters's features and benefits. Learn about our game collection, instant play technology, and enjoy the best unblocked games online.",
  alternates: {
    canonical: "https://sprunksters.top/features",
  },
}