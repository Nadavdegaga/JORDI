import AnimatedSection from "@/components/AnimatedSection";
import TextReveal from "@/components/TextReveal";
import LeadCta from "./LeadCta";
import heroGlobe from "@/assets/geo-sphere.jpg";
import { RESPONSE_PROMISE } from "@/config/landing";
import { useSectionTracking } from "@/hooks/useFunnelTracking";

interface FinalCtaSectionProps {
  onQualify: () => void;
}

const FinalCtaSection = ({ onQualify }: FinalCtaSectionProps) => {
  const ref = useSectionTracking<HTMLElement>("final_cta");

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroGlobe}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "saturate(0.7) brightness(0.45)" }}
        />
        <div className="absolute inset-0 bg-[#050607]/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/90" />
      </div>

      <div className="relative z-10 section-padding py-28 md:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-display text-foreground mb-4">
            <TextReveal>שיחה אחת</TextReveal>{" "}
            <span className="text-gradient-gold">
              <TextReveal delay={0.2}>של 30 דקות</TextReveal>
            </span>
          </h2>

          <AnimatedSection delay={0.4}>
            <p className="text-body text-foreground/75 max-w-xl mx-auto mb-3">
              נעבור על התהליכים שלכם, נראה איפה נשרף הזמן ונגיד לכם בכנות מה שווה
              לאוטמט ומה לא. גם אם לא תעבדו איתנו — תצאו עם מפה ברורה.
            </p>
            <p className="text-sm text-primary/80 mb-10">
              ללא עלות · ללא התחייבות · {RESPONSE_PROMISE}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.55}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <LeadCta label="דברו איתנו בוואטסאפ" source="final_cta" className="w-full sm:w-auto" />
              <button
                type="button"
                onClick={onQualify}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg px-8 py-4 text-sm font-medium border border-primary/30 text-primary/90 hover:border-primary/60 hover:bg-primary/5 transition-all duration-500 cursor-pointer"
              >
                בדקו מה מתאים לכם
              </button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
