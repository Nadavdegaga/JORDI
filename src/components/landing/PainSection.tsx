import AnimatedSection from "@/components/AnimatedSection";
import GoldDivider from "@/components/GoldDivider";
import { PAIN_POINTS } from "@/config/landing";
import { useSectionTracking } from "@/hooks/useFunnelTracking";

const PainSection = () => {
  const ref = useSectionTracking<HTMLElement>("pain");

  return (
    <section ref={ref} className="section-padding section-dark">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <p className="text-label text-primary mb-4 text-center">מוכר לכם?</p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="heading-section text-center text-foreground mb-6">
            איפה נשרפות <span className="text-gradient-gold">השעות שלכם</span>
          </h2>
        </AnimatedSection>

        <GoldDivider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-14">
          {PAIN_POINTS.map((point, index) => (
            <AnimatedSection key={point.title} delay={0.15 + index * 0.1}>
              <div className="group h-full p-7 md:p-8 rounded-lg border border-border/40 bg-card/30 hover:border-primary/25 transition-all duration-700">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-label text-primary/40 text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg md:text-xl font-medium text-foreground">{point.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.body}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5}>
          <p className="text-center text-muted-foreground text-sm mt-12 max-w-2xl mx-auto">
            כל אחד מהדברים האלה נראה קטן בנפרד. יחד הם מסתכמים בימי עבודה שלמים בכל
            חודש — ובכסף שלא נכנס כי לא היה זמן לרדוף אחריו.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PainSection;
