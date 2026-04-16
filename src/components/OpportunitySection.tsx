import AnimatedSection from "./AnimatedSection";
import GoldDivider from "./GoldDivider";

const regions = [
  {
    name: "Dubai",
    description:
      "A global commercial hub with institutional demand for AI infrastructure across fintech, logistics, healthcare, and real estate.",
  },
  {
    name: "Israel",
    description:
      "Access to the world's densest ecosystem of deep-tech, cybersecurity, and enterprise AI — curated for cross-border deployment.",
  },
  {
    name: "USA",
    description:
      "Silicon Valley's frontier AI capabilities — filtered and adapted for institutional-grade commercial deployment in new markets.",
  },
];

const OpportunitySection = () => {
  return (
    <section id="opportunity" className="section-padding section-dark relative">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-label text-primary mb-4 text-center">
            The Opportunity
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="heading-section text-center text-foreground mb-4">
            Three Pillars of Market Access
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <p className="text-body text-muted-foreground text-center max-w-2xl mx-auto mb-6">
            Connecting proven AI technologies with high-growth commercial
            opportunities across the UAE and GCC markets.
          </p>
        </AnimatedSection>

        <GoldDivider />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16">
          {regions.map((region, index) => (
            <AnimatedSection
              key={region.name}
              delay={0.2 + index * 0.15}
              direction={index === 0 ? "left" : index === 2 ? "right" : "up"}
            >
              <div className="group relative p-8 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-700">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-4 tracking-[0.02em]">
                  {region.name}
                </h3>
                <div className="w-8 h-px bg-gradient-gold mb-5" />
                <p className="text-body text-muted-foreground text-sm leading-relaxed">
                  {region.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpportunitySection;
