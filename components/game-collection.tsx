import Image from "next/image";
import { Star } from "lucide-react";

interface GameInfo {
  title: string;
  rating: number;
  votes: number;
  descriptionTitle: string;
  description: string;
  featureTitle: string;
  features: string[];
  image: string;
  imageAlt: string;
}

const games: GameInfo[] = [
  {
    title: "Sprunki Incredibox",
    rating: 5.0,
    votes: 28470,
    descriptionTitle: "The Original Horror Rhythm",
    description: "Experience the groundbreaking collaboration between Incredibox and Sprunki, transforming the classic music creation tool into a spine-chilling adventure. Drawing inspiration from FNAF's atmosphere, this original version sets the foundation for a whole new genre of horror rhythm games.",
    featureTitle: "Signature Horror Elements",
    features: [
      "Freddy's inspired chilling atmosphere",
      "Classic Incredibox music tools",
      "Horror-themed character designs"
    ],
    image: "/gamecollection/gamecollection-sprunkisprunkr.webp",
    imageAlt: "Sprunki Sprunkr Original Version"
  },
  {
    title: "Sprunki Sprunkr 2.0",
    rating: 5.0,
    votes: 2156,
    descriptionTitle: "Refined Horror Experience",
    description: "Step into the enhanced world of Sprunki Sprunkr 2.0, featuring comprehensive upgrades in graphics, animations, and sound effects. This refined version delivers a more immersive and polished music creation experience while maintaining the series' signature horror elements.",
    featureTitle: "Enhanced Creation Tools",
    features: [
      "Upgraded visuals and animations",
      "Enhanced sound library",
      "Improved creation interface"
    ],
    image: "/gamecollection/gamecollection-sprunkisprunkr2.webp",
    imageAlt: "Sprunki Sprunkr 2.0 Version"
  },
  {
    title: "Sprunkr 4 OC",
    rating: 5.0,
    votes: 1893,
    descriptionTitle: "Community Masterpiece",
    description: "Dive into this fan-made masterpiece featuring an incredible roster of 41 characters. Sprunkr 4 OC expands the universe with hidden secrets, new sound combinations, and the triumphant return of Mr. Fun Computer with his unique performance style.",
    featureTitle: "Expanded Universe",
    features: [
      "41 unique characters to discover",
      "Mr. Fun Computer's return",
      "Hidden secrets and combinations"
    ],
    image: "/gamecollection/gamecollection-sprunkr4oc.webp",
    imageAlt: "Sprunkr 4 OC Version"
  }
];

export function GameCollection() {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading text-primary mb-4">
          The Sprunksters Games Collection
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Journey through the evolution of Sprunksters, from its horror-inspired origins to the community-driven masterpiece
        </p>
      </div>

      {/* Games Grid */}
      <div className="space-y-16">
        {games.map((game, index) => (
          <div key={index} className="space-y-0">
            {/* Title and Rating Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/0 rounded-xl p-4">
              <h3 className="text-2xl md:text-3xl font-heading text-primary">
                {game.title}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-primary">
                  {game.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({game.votes.toLocaleString()} votes)
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div
              className="flex flex-col md:flex-row gap-10 items-center bg-card/40 rounded-2xl p-8"
              style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-border">
                  <img
                    src={game.image}
                    alt={game.imageAlt}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Text Content Section */}
              <div className="w-full md:w-1/2 space-y-6">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xl font-heading text-foreground">
                    {game.descriptionTitle}
                  </h4>
                  <p className="text-foreground text-lg leading-relaxed">
                    {game.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="text-xl font-heading text-foreground">
                    {game.featureTitle}
                  </h4>
                  <ul className="grid gap-3">
                    {game.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-foreground text-lg">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 