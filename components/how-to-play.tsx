import { cn } from "@/lib/utils";
import Image from "next/image";

interface Step {
  number: number;
  title: string;
  description: string;
  tips: string[];
  area: {
    name: string;
    hazards: string[];
  };
  image?: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Select Your Musical Characters",
    description: "Start your musical journey by exploring Sprunki Sprunksters' colorful cast of characters. Each performer brings their own unique sounds and animations to your composition - from funky melodies to offbeat rhythms. Simply browse through the available characters and find the ones that spark your creativity.",
    tips: [
      "Listen to each character's unique sound before adding them",
      "Pay attention to the different sound types (beats, melodies, effects)",
      "Start with rhythm characters as your foundation",
      "Experiment with different character combinations"
    ],
    area: {
      name: "Character Selection",
      hazards: [
        "Beats: Create your rhythmic foundation",
        "Melodies: Add musical themes",
        "Effects: Enhance your mix",
        "Vocals: Bring personality to your track"
      ]
    },
    image: "/howtoplay/step-1.webp"
  },
  {
    number: 2,
    title: "Create Your Musical Masterpiece",
    description: "Making music in Sprunki Sprunksters is beautifully simple - just drag and drop characters onto your stage! Watch as they come to life with distinctive animations and blend their sounds together. Try different combinations to discover unexpected harmonies and create your own unique musical story.",
    tips: [
      "Drag and drop characters to add them to your mix",
      "Click characters to toggle their sounds on/off",
      "Use the spacebar to play/pause your creation",
      "Press 'R' to reset and start fresh"
    ],
    area: {
      name: "Music Creation",
      hazards: [
        "Stage Management: Organize your performers",
        "Sound Mixing: Balance your elements",
        "Rhythm Control: Keep the beat flowing",
        "Performance: Watch your creation come alive"
      ]
    },
    image: "/howtoplay/step-2.webp"
  },
  {
    number: 3,
    title: "Discover Hidden Surprises",
    description: "Sprunki Sprunksters is full of delightful secrets waiting to be uncovered! As you experiment with different character combinations, you might trigger special animations and unlock bonus characters. Keep exploring and mixing to discover all the magical moments this musical playground has to offer.",
    tips: [
      "Try different character combinations",
      "Watch for special animations",
      "Look for hidden bonus characters",
      "Share your discoveries with the community"
    ],
    area: {
      name: "Secret Features",
      hazards: [
        "Bonus Content: Find hidden characters",
        "Special Animations: Trigger unique performances",
        "Creative Combinations: Unlock new possibilities",
        "Community Sharing: Show off your discoveries"
      ]
    },
    image: "/howtoplay/step-3.webp"
  }
];

export function HowToPlay() {
  return (
    <section className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-block bg-card/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-border">
          <h2 className="text-2xl font-heading text-primary">
            Master Sprunki Sprunksters Music Gameplay
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how to create powerful musical combinations while mastering the art of Sprunki Sprunksters
        </p>
      </div>

      <div className="grid gap-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center gap-4 bg-primary/5 border-b border-border p-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-background font-heading text-lg">
                {step.number}
              </span>
              <h3 className="text-xl font-heading text-primary">
                {step.title}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid gap-8 md:grid-cols-3">
                {/* Description Column */}
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Tips Column */}
                <div className="space-y-4">
                  <h4 className="font-heading text-foreground text-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Tips
                  </h4>
                  <ul className="grid gap-2.5">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/50 flex-shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Area Info or Image */}
                <div className="space-y-4">
                  {step.image ? (
                    <>
                      <h4 className="font-heading text-foreground text-lg flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Preview
                      </h4>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border/50">
                        <Image
                          src={step.image}
                          alt={`Step ${step.number}: ${step.title}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="font-heading text-foreground text-lg flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {step.area.name}
                      </h4>
                      <ul className="grid gap-2.5">
                        {step.area.hazards.map((hazard, i) => (
                          <li key={i} className="flex items-start gap-3 group">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/50 flex-shrink-0 group-hover:scale-125 transition-transform" />
                            <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                              {hazard}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
