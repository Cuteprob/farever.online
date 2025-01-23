interface VisualStage {
  title: string;
  image: string;
  visualFeature: string;
}

const stages: VisualStage[] = [
  {
    title: "Sprunki sprunksters",
    image: "/visualevolution/visualevolution-sprunksters.webp",
    visualFeature: "Classic Horror with Neon Accents"
  },
  {
    title: "Sprunksters 2.0",
    image: "/visualevolution/visualevolution-sprunksters2.webp",
    visualFeature: "Enhanced Shadows and Dynamic Lighting"
  },
  {
    title: "Sprunksters 4 OC",
    image: "/visualevolution/visualevolution-sprunksters4oc.webp",
    visualFeature: "Immersive Dark Fantasy Environment"
  }
];

export function VisualEvolution() {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-heading text-primary mb-4">
          Visual Evolution of Sprunksters
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Witness the artistic journey of Sprunksters through its generations
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {stages.map((stage, index) => (
          <div key={index} className="group space-y-4">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={stage.image}
                alt={`${stage.title} visual style`}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-heading text-primary">
                {stage.title}
              </h3>
              <h4 className="text-foreground/80">
                {stage.visualFeature}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 