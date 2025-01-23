import { Music, Waves, Layers, Sparkles } from "lucide-react";

interface SoundFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: SoundFeature[] = [
  {
    title: "Diverse Musical Elements",
    description: "Explore Sprunki Sprunksters' rich collection of sounds - from funky melodies to offbeat rhythms. Each character brings their own unique musical contribution to create an engaging and dynamic soundscape.",
    icon: <Music className="w-8 h-8 text-primary" />
  },
  {
    title: "Real-time Sound Mixing",
    description: "Experience Sprunki Sprunksters' intuitive mixing system where you can blend different character sounds in real-time. Create layered compositions by combining beats, melodies, and effects as your characters perform together.",
    icon: <Layers className="w-8 h-8 text-primary" />
  },
  {
    title: "Interactive Sound Design",
    description: "Discover the magic of Sprunki Sprunksters' drag-and-drop sound system. Watch and listen as your characters come to life, each animation perfectly synchronized with their unique musical contributions.",
    icon: <Waves className="w-8 h-8 text-primary" />
  },
  {
    title: "Creative Sound Combinations",
    description: "Unlock hidden musical surprises in Sprunki Sprunksters by experimenting with different character combinations. Each new arrangement can lead to unexpected and delightful sound discoveries.",
    icon: <Sparkles className="w-8 h-8 text-primary" />
  }
];

export function SoundFeatures() {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading text-primary mb-4">
          The Sound of Sprunki Sprunksters
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Experience the unique audio elements that make Sprunki Sprunksters a groundbreaking musical horror adventure
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group p-6 bg-gradient-to-b from-card/30 to-card/10 hover:from-card/40 hover:to-card/20 rounded-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading text-primary group-hover:text-primary/90">
                {feature.title}
              </h3>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
} 