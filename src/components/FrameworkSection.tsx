import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedSection from "./AnimatedSection";
import GoldDivider from "./GoldDivider";
import { Phone, PenTool, Code, Rocket } from "lucide-react";
import mosqueDome from "@/assets/neon-cube.jpg";

const steps = [
  {
    icon: Phone,
    title: "שיחת היכרות",
    description:
      "מבינים את העסק, את האתגרים ואת החלום.",
  },
  {
    icon: PenTool,
    title: "תכנון ועיצוב",
    description:
      "בונים מוק-אפ ומאשרים שזה בדיוק מה שרציתם.",
  },
  {
    icon: Code,
    title: "פיתוח וחיבור",
    description:
      "מפתחים, מחברים אינטגרציות ובודקים הכל.",
  },
  {
    icon: Rocket,
    title: "השקה וליווי",
    description:
      "משיקים ומלווים אתכם עד שהכל רץ חלק.",
  },
];

const FrameworkSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} className="section-dark relative overflow-hidden">
      {/* Sticky parallax background image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={mosqueDome}
          alt=""
          className="w-full h-[120%] object-cover object-[30%_50%]"
          style={{
            y: bgY,
            filter: "saturate(0.6) brightness(0.45)",
          }}
        />
        <div className="absolute inset-0 bg-[#0B0D10]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/70" />
      </div>

      {/* Label strip */}
      <div className="relative z-10 pt-24 pb-4 px-6 md:px-12 lg:px-24 xl:px-32">
        <div className="max-w-6xl mx-auto">
          <p className="text-label text-primary/40 tracking-[0.4em]">תהליך העבודה</p>
        </div>
      </div>

      <div className="relative z-10 section-padding pt-12">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p className="text-label text-primary mb-4 text-center">
              איך זה עובד
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <h2 className="heading-section text-center text-foreground mb-6">
              4 צעדים ל<span className="text-gradient-gold">מערכת חלומות</span>
            </h2>
          </AnimatedSection>

          <GoldDivider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={index} delay={0.15 + index * 0.12}>
                  <div className="group relative p-8 md:p-10 rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/25 transition-all duration-700 h-full">
                    <div className="absolute top-0 left-8 right-8 h-px bg-gradient-gold opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
                    
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-colors duration-500">
                        <Icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors duration-500" />
                      </div>
                      <span className="text-label text-muted-foreground text-xs">
                        שלב {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl md:text-2xl font-light text-foreground mb-3 tracking-[0.02em]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameworkSection;