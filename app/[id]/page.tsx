import { Metadata } from "next";
import { Game, games } from "@/config/sprunkigame";
import { GamesSidebar } from "@/components/games-sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GameDescription } from "@/components/game-description";
import { Comments } from "@/components/comments";
import { Icons } from "@/config/icons";
import { GameAreaLayout } from "@/components/game-area-layout";
import { GameCategory, getAllGames, getGameById } from "@/models/productGames";

interface GamePageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export const runtime = "edge";

// 预生成所有游戏页面
export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map((game) => ({
    id: game.id,
  }))
}

// 静态生成 metadata
export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const game = await getGameById(params.id);

  if (!game) {
    return {
      title: "Game Not Found",
    };
  }

  return {
    title: game.metadata?.title || "Sprunksters Game",
    description: game.metadata?.description || "Play free online music games",
    keywords: game.metadata?.keywords || ["music game", "online game"],
    openGraph: {
      title: game.metadata?.title || "Sprunksters Game",
      description: game.metadata?.description || "Play free online music games",
      images: [(game.image || "/default-game-image.jpg")],
    },
    alternates: {
      canonical: `https://sprunksters.top/${params.id}`,
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameById(params.id);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* 面包屑导航 */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Play Sprunksters", href: "/" },
              { label: game.title, href: `/${game.id}` },
            ]}
          />
        </div>

        {/* Hero Section */}
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-heading text-primary tracking-tight">
              {game.title}
            </h1>
            <h2 className="text-lg md:text-xl italic font-heading text-muted-foreground tracking-wide">
              Play {game.title} Online for Free!
            </h2>
          </div>

          {/* Game Container */}
          <GameAreaLayout game={game as Game} />

          {/* Game Description Section */}
          <div className="space-y-12">
            <GameDescription game={game as Game} />

            {/* Related Games & Comments */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Games Sidebar - Left Side */}
                <div className="md:col-span-1">
                  <h2 className="text-xl font-heading mb-4">More Hot Games</h2>
                  <GamesSidebar
                   limit={9}
                  />
                </div>

                {/* Comments - Right Side */}
                <div className="md:col-span-1">
                  <h2 className="text-xl font-heading mb-4">Comments</h2>
                  <Comments />
                </div>
              </div>
            </div>

            {/* How to Play Section */}
            <section className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border">
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-heading text-primary">
                    How to Play {game.title}
                  </h2>
                  <div className="flex-1 border-t border-border"></div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Controls Guide */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-primary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                          />
                        </svg>
                      </span>
                      <h3 className="text-lg font-heading text-primary">
                        Controls Guide
                      </h3>
                    </div>

                    <div className="grid gap-6">
                      {/* Basic Movement */}
                      <div className="bg-card/50 rounded-xl p-4 border border-border/50">
                        <h4 className="font-heading text-primary mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Basic Movement
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                          {game.controls?.guide?.movement?.map(
                            (control: string, index: number) => (
                              control && (
                                <li
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                                  <span>{control}</span>
                                </li>
                              )
                            )
                          )?.filter(Boolean)}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="bg-card/50 rounded-xl p-4 border border-border/50">
                        <h4 className="font-heading text-primary mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Actions
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                          {game.controls?.guide?.actions?.map((action: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Visual Guide */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-primary/10">
                        {Icons.visualGuide}
                      </span>
                      <h3 className="text-lg font-heading text-primary">
                        Visual Guide
                      </h3>
                    </div>

                    {/* YouTube Video */}
                    <div className="aspect-video rounded-xl overflow-hidden border border-border/50">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${game.video?.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                        title={`How to play ${game.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>

                    {/* Optional: Video Title */}
                    <div className="text-sm text-muted-foreground text-center">
                      {`How to play ${game.title}`}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="max-w-4xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Features */}
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="p-2 rounded-xl bg-primary/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </span>
                    <h3 className="text-lg font-heading text-primary">
                      Core Features
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {(game.features ?? []).slice(0, 4).map((feature: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="mt-1 flex-shrink-0">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Features */}
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="p-2 rounded-xl bg-primary/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <h3 className="text-lg font-heading text-primary">
                      Additional Features
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {(game.features ?? []).slice(4, 8).map((feature: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="mt-1 flex-shrink-0">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-heading text-primary">
                    Frequently Asked Questions
                  </h2>
                  <div className="flex-1 border-t border-border"></div>
                </div>

                <div className="grid gap-8">
                  {(game.faqs ?? []).map((faq: { category?: string, question?: string, answer?: string }, index: number) => (
                    faq?.question && faq?.answer && (
                      <div key={index} className="space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="p-1.5 rounded-lg bg-primary/10 text-primary text-sm">
                            {faq.category?.charAt(0).toUpperCase() ?? 'Q'}
                          </span>
                          <h3 className="text-lg font-heading text-primary">
                            {faq.question}
                          </h3>
                        </div>
                        <div className="pl-10">
                          <p className="text-base leading-relaxed text-muted-foreground">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="max-w-4xl mx-auto space-y-4 bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-heading text-primary">
                    Ready to Create Your Musical Masterpiece?
                  </h2>
                  <p className="text-foreground/90 text-lg max-w-2xl mx-auto">
                    Join millions of players worldwide in {game.title} and
                    experience the thrill of creating energetic music
                    compositions!
                  </p>
                  <div className="pt-4">
                    <Link
                      href="#game"
                      className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
                      scroll={true}
                    >
                      Start Playing {game.title} Now
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
