import { HowToPlay } from "@/components/how-to-play";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { RelatedGames } from "@/components/related-games";

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-10 space-y-4 max-w-7xl">
        <Breadcrumb 
          items={[
            { label: "Play Sprunksters", href: "/" },
            { label: "How to Play", href: "/how-to-play" }
          ]} 
        />
        <div className="space-y-16">
          <HowToPlay />
          {/* <RelatedGames /> */}
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: "How to Play Sprunksters Games Online - Sprunksters",
  description: "Learn how to play Sprunksters Games. Get started with our easy-to-follow guide. Discover controls, strategies for all our browser games.",
  alternates: {
    canonical: "https://sprunksters.top/how-to-play",
  },
}
