import Image from "next/image";

interface GameInfo {
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
}

const games: GameInfo[] = [
  {
    title: "Sprunki sprunksters (Original)",
    description: "Experience the original Sprunki sprunksters where Incredibox meets rhythm gaming. This thrilling collaboration transforms music creation into an electrifying adventure, featuring spine-tingling atmosphere and immersive gameplay that will captivate your senses.",
    features: [
      "Unique horror-themed musical environment",
      "Intuitive drag-and-drop music creation",
      "Classic character roster with dark twists"
    ],
    image: "/sprunki-sprunkr.webp",
    imageAlt: "Sprunki sprunksters Original Version"
  },
  {
    title: "Sprunki Sprunkr 2.0",
    description: "Sprunki Sprunkr 2.0 elevates the original experience with enhanced visuals and refined gameplay mechanics. This reimagined version brings smoother animations, richer sound loops, and an even more immersive music creation journey.",
    features: [
      "Enhanced visuals and polished animations",
      "Expanded sound library and effects",
      "Streamlined music creation interface"
    ],
    image: "/sprunki-sprunkr-2.webp",
    imageAlt: "Sprunki Sprunkr 2.0 Version"
  },
  {
    title: "Sprunkr 4 OC",
    description: "Discover the ultimate evolution in Sprunkr 4 OC, featuring an incredible roster of 41 unique characters. This fan-made masterpiece pushes creative boundaries with thrilling new sounds and hidden secrets waiting to be uncovered.",
    features: [
      "Massive 41-character roster with secrets",
      "Brand new sound combinations",
      "Exclusive character interactions"
    ],
    image: "/sprunkr-4-oc.webp",
    imageAlt: "Sprunkr 4 OC Version"
  }
];

export function ExploreGames() {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading text-primary mb-4">
          Explore The Sprunksters Games
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover the evolution through its different versions, each offering unique features and experiences
        </p>
      </div>

      {/* Games Grid */}
      <div className="space-y-16">
        {games.map((game, index) => (
          <div
            key={index}
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

            {/* Content Section */}
            <div className="w-full md:w-1/2 space-y-6">
              <h3 className="text-2xl md:text-3xl font-heading text-primary">
                {game.title}
              </h3>
              <p className="text-foreground text-lg leading-relaxed">
                {game.description}
              </p>
              <div className="space-y-4">
                
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
        ))}
      </div>
    </section>
  );
} 