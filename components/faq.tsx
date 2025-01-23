interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Sprunki Sprunksters and how do you play it?",
    answer: "Sprunki Sprunksters is an exciting fan-made mod for Incredibox that turns music creation into a wild adventure. It features a simple drag-and-drop interface where you can select colorful characters and place them on stage to create music. Each character brings their own unique sounds and animations, allowing you to mix and match to create unexpected musical combinations.",
    category: "General",
  },
  {
    question: "How do I create music in Sprunki Sprunksters?",
    answer: "Creating music in Sprunki Sprunksters is surprisingly simple: 1) Select characters from the available cast 2) Drag and drop them onto your stage 3) Watch and listen as they perform their unique sounds 4) Click characters to toggle their sounds on/off 5) Use spacebar to play/pause and 'R' to reset. You can experiment with different combinations to create your own unique musical pieces.",
    category: "Gameplay",
  },
  {
    question: "What makes Sprunki Sprunksters different from other music games?",
    answer: "Sprunki Sprunksters stands out through its vibrant characters, each with distinctive animations and sounds that create unexpected musical combinations. The game offers an intuitive interface that makes music creation accessible to everyone, while providing enough depth through various sound combinations and hidden surprises to keep experienced users engaged.",
    category: "Features",
  },
  {
    question: "Can I share my Sprunki Sprunksters musical creations?",
    answer: "Yes! Sprunki Sprunksters has a strong community focus. Once you've crafted your musical masterpiece, you can share it with the vibrant Incredibox community. This allows you to showcase your creativity and discover what magical compositions others have created in the Sprunki Sprunksters universe.",
    category: "Community",
  },
  {
    question: "Is Sprunki Sprunksters suitable for beginners?",
    answer: "Absolutely! Sprunki Sprunksters welcomes players of all skill levels. Its intuitive drag-and-drop interface makes it easy to jump right in, even if you have no prior music creation experience. While simple to start, the game offers enough depth through possible combinations to keep you discovering new things as you progress.",
    category: "General",
  },
  {
    question: "What are the key features of Sprunki Sprunksters?",
    answer: "Sprunki Sprunksters features: 1) A colorful cast of characters with unique sounds and animations 2) Intuitive drag-and-drop interface for easy music creation 3) Real-time mixing capabilities 4) Hidden surprises and bonus characters to discover 5) Community sharing features to showcase your creations 6) Multiple sound combinations for endless musical possibilities.",
    category: "Features",
  },
  {
    question: "How do I discover all of Sprunki Sprunksters' hidden content?",
    answer: "Exploring Sprunki Sprunksters is part of the fun! Try different character combinations, experiment with various arrangements, and watch for special animations. The game rewards creativity and experimentation with hidden surprises, bonus characters, and unexpected musical discoveries.",
    category: "Gameplay",
  },
  {
    question: "What controls do I need to know for Sprunki Sprunksters?",
    answer: "Sprunki Sprunksters has simple, intuitive controls: Drag & Drop to add sounds, Click to toggle sounds on/off, Spacebar to play/pause your composition, and 'R' key to reset. These basic controls make it easy to focus on the creative aspects of music making.",
    category: "Gameplay",
  }
];

export function FAQ() {
  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-heading text-primary mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">
          Find answers about Sprunki Sprunksters' music creation, characters, and features
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="grid gap-8">
        {Object.entries(
          faqs.reduce((acc, faq) => {
            const category = faq.category || 'General';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(faq);
            return acc;
          }, {} as Record<string, FAQItem[]>)
        ).map(([category, items]) => (
          <div key={category} className="space-y-6">
            <div className="grid gap-4">
              {items.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg border border-border"
                >
                  <div className="border-b border-border p-4">
                    <h4 className="text-lg font-heading text-primary">
                      {faq.question}
                    </h4>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
