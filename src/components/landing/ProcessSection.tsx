import AnimatedSection from "@/components/AnimatedSection";
import GoldDivider from "@/components/GoldDivider";
import { PROCESS_STEPS } from "@/config/landing";
import { useSectionTracking } from "@/hooks/useFunnelTracking";

const ProcessSection = () => {
  const ref = useSectionTracking<HTMLElement>("process");

  return (
    <section ref={ref} className="section-padding section-darker">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <p className="text-label text-primary mb-4 text-center">איך מתחילים</p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="heading-section text-center text-foreground mb-6">
            מהשיחה הראשונה ועד <span className="text-gradient-gold">שזה רץ לבד</span>
          </h2>
        </AnimatedSection>

        <GoldDivider />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {PROCESS_STEPS.map((step, index) => (
            <AnimatedSection key={step.title} delay={0.12 + index * 0.1}>
              <div className="relative h-full p-7 rounded-lg border border-border/40 bg-card/30 hover:border-primary/25 transition-all duration-700">
                <span className="text-4xl font-bold text-primary/15 leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-medium text-foreground mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.body}</p>
                <span className="inline-block text-[11px] tracking-wider text-primary/80 border border-primary/25 rounded-full px-3 py-1">
                  {step.note}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
