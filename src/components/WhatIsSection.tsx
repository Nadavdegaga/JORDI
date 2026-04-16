import { useRef, useCallback } from "react";
import AnimatedSection from "./AnimatedSection";
import GoldDivider from "./GoldDivider";

const statements = [
  "An institutional filtering mechanism for global innovation",
  "Selecting only the top 1% of technologies worldwide",
  "Built for enterprise and institutional deployment",
  "Designed for long-term commercial value, not experimentation",
];

const SpotlightRow = ({ statement, index }: { statement: string; index: number }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rowRef.current?.style.setProperty("--spot-x", `${x}px`);
    rowRef.current?.style.setProperty("--spot-y", `${y}px`);
  }, []);

  return (
    <AnimatedSection delay={0.2 + index * 0.2}>
      <div
        ref={rowRef}
        onMouseMove={handleMouseMove}
        className="relative flex items-start gap-6 group rounded-lg px-4 py-5 -mx-4 overflow-hidden transition-colors duration-500"
      >
        {/* Spotlight glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(var(--primary) / 0.12), transparent 70%)",
          }}
        />
        <span className="relative z-10 text-label text-primary/50 group-hover:text-primary/80 mt-1 shrink-0 w-8 transition-colors duration-500">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative z-10 flex-1">
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground/90 leading-snug group-hover:text-foreground transition-colors duration-500">
            {statement}
          </p>
          <div className="mt-4 h-px bg-border/50 group-hover:bg-primary/30 transition-colors duration-700" />
        </div>
      </div>
    </AnimatedSection>
  );
};

const WhatIsSection = () => {
  return (
    <section className="section-padding section-darker">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="text-label text-primary mb-4 text-center">
            What RoyalX Is
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="heading-section text-center text-foreground mb-6">
            Institutional-Grade <span className="text-gradient-gold">Precision</span>
          </h2>
        </AnimatedSection>

        <GoldDivider />

        <div className="mt-16 space-y-4">
          {statements.map((statement, index) => (
            <SpotlightRow key={index} statement={statement} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
