import { Music2, Gamepad2, Video, Share2, Users } from "lucide-react";

interface GuideGroup {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

const guides: GuideGroup[] = [
  {
    title: "For Music Enthusiasts",
    description: "Create your unique musical masterpieces in Sprunki Sprunksters",
    features: [
      "Experiment with funky melodies and offbeat rhythms",
      "Mix and match characters to create unexpected harmonies",
      "Discover hidden musical combinations and surprises"
    ],
    icon: <Music2 className="w-6 h-6" strokeWidth={1.5} />
  },
  {
    title: "For Beginners",
    description: "Start your musical journey with Sprunki Sprunksters' intuitive system",
    features: [
      "Learn the simple drag-and-drop interface",
      "Explore basic sound combinations",
      "Watch your characters perform together"
    ],
    icon: <Gamepad2 className="w-6 h-6" strokeWidth={1.5} />
  },
  {
    title: "For Creative Composers",
    description: "Take your Sprunki Sprunksters compositions to the next level",
    features: [
      "Create complex layered arrangements",
      "Share your musical creations with the community",
      "Discover and learn from other creators"
    ],
    icon: <Video className="w-6 h-6" strokeWidth={1.5} />
  },
  {
    title: "For Incredibox Fans",
    description: "Experience the exciting world of Sprunki Sprunksters mod",
    features: [
      "Explore new characters and sound combinations",
      "Create unique musical interpretations",
      "Join the vibrant Sprunki Sprunksters community"
    ],
    icon: <Users className="w-6 h-6" strokeWidth={1.5} />
  }
];

export function CommunityGuide() {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading text-primary mb-4">
          Who Should Play Sprunki Sprunksters?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Whether you're a music enthusiast, gamer, or content creator, Sprunki Sprunksters offers an addictive musical playground where creativity knows no bounds
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {guides.map((guide, index) => (
          <div 
            key={index}
            className="group p-6 bg-gradient-to-b from-card/30 to-card/10 hover:from-card/40 hover:to-card/20 rounded-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {guide.icon}
              </div>
              <h3 className="text-xl font-heading text-primary">
                {guide.title}
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              {guide.description}
            </p>
            <ul className="space-y-2">
              {guide.features.map((feature, featureIndex) => (
                <li 
                  key={featureIndex}
                  className="flex items-center gap-2 text-foreground/80"
                >
                  <Share2 className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
} 