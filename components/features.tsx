import React from 'react';

interface Feature {
  title: string;
  description: string[];
  highlight: string;
  category: 'evolution' | 'gameplay' | 'technical' | 'characters' | 'social';
}

const features: Feature[] = [
  {
    title: "Intuitive Music Creation",
    description: [
      "Create amazing music with Sprunki Sprunksters' simple drag-and-drop interface - perfect for both beginners and music enthusiasts",
      "Watch your music come alive as colorful characters perform their unique animations and sounds",
      "Mix and match different sound elements to discover unexpected musical combinations in Sprunksters"
    ],
    highlight: "Easy to Play",
    category: "gameplay"
  },
  {
    title: "Dynamic Sound System",
    description: [
      "Explore Sprunki Sprunksters' diverse collection of musical loops, from funky melodies to offbeat rhythms",
      "Build layered compositions by combining different character sounds in Sprunki Sprunksters",
      "Experience real-time sound mixing as your characters perform together on stage",
      "Create endless musical possibilities with Sprunki Sprunksters' innovative loop-based system"
    ],
    highlight: "Rich Sounds",
    category: "technical"
  },
  {
    title: "Vibrant Character Ensemble",
    description: [
      "Choose from Sprunki Sprunksters' expressive cast of performers, each with their own musical personality",
      "Discover how different characters interact and complement each other's sounds",
      "Unlock hidden animations and bonus characters as you explore Sprunki Sprunksters' musical world"
    ],
    highlight: "Unique Characters",
    category: "characters"
  },
  {
    title: "Community Features",
    description: [
      "Share your Sprunki Sprunksters musical creations with a vibrant community of fellow composers",
      "Discover and learn from other players' creative musical arrangements",
      "Join the growing Sprunki Sprunksters community in spreading the joy of music creation"
    ],
    highlight: "Share & Connect",
    category: "social"
  }
];

export function Features() {
  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-heading text-primary mb-4">
          Explore Sprunki Sprunksters' Musical Magic
        </h2>
        <p className="text-muted-foreground">
          Discover an innovative music creation experience with unique characters and endless possibilities
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card rounded-lg border border-border"
          >
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-border p-4">
              <h3 className="text-xl font-heading text-primary flex-1">
                {feature.title}
              </h3>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {feature.highlight}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid gap-4">
                {feature.description.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <p className="text-muted-foreground text-sm">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
