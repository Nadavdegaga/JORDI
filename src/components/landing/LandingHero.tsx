import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-lightbulb.jpg";
import TextReveal from "@/components/TextReveal";
import LeadCta from "./LeadCta";
import { TRUST_SIGNALS } from "@/config/landing";

interface LandingHeroProps {
  onQualify: () => void;
}

const LandingHero = ({ onQualify }: LandingHeroProps) => {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" style={{ filter: "saturate(0.85)" }} />
        <div className="absolute inset-0 bg-[#050607]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050607]/60 via-transparent to-background" />
      </div>

      {/* Extra bottom padding keeps the last line clear of the fixed a11y button. */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-20 pb-24 md:py-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-label text-primary mb-4 md:mb-6 tracking-[0.3em] !normal-case"
        >
          PitStop Automations
        </motion.p>

        {/* Sized down from .heading-display: the longer headline needs to clear
            the fold on a 375px screen without the top line being cut off. */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-[0.02em] text-foreground mb-5">
          <TextReveal delay={0.4}>אתם מבזבזים</TextReveal>{" "}
          <span className="text-gradient-gold">
            <TextReveal delay={0.6}>שעות של עבודה ידנית</TextReveal>
          </span>{" "}
          <TextReveal delay={0.85}>על העסק שלכם</TextReveal>
        </h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-px bg-gradient-gold mx-auto mb-6 md:mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-foreground max-w-2xl mx-auto mb-4"
        >
          אנחנו בונים <span className="text-primary font-semibold">אוטומציות, מערכות ניהול ואינטגרציות</span>{" "}
          שעושות את העבודה החוזרת במקומכם — כדי שתחזרו לעסוק בעסק עצמו.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="text-sm text-primary/80 mb-10"
        >
          מחירים שקופים באתר · שיחת אפיון ללא עלות
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <LeadCta
            label="לשיחת אפיון ללא עלות"
            source="hero_primary"
            className="w-full sm:w-auto"
          />
          <button
            type="button"
            onClick={scrollToPricing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-medium tracking-[0.05em] border border-primary/30 text-primary/90 hover:border-primary/60 hover:bg-primary/5 transition-all duration-500 cursor-pointer"
          >
            לראות מחירים
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="grid grid-cols-2 gap-x-4 gap-y-2.5 max-w-sm mx-auto sm:flex sm:flex-wrap sm:max-w-none sm:justify-center sm:gap-x-5"
        >
          {TRUST_SIGNALS.map((signal) => (
            <span
              key={signal}
              className="inline-flex items-start gap-1.5 text-xs text-muted-foreground text-right leading-snug"
            >
              <Check className="w-3.5 h-3.5 text-primary/70 shrink-0 mt-0.5" />
              {signal}
            </span>
          ))}
        </motion.div>

        <motion.button
          type="button"
          onClick={onQualify}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.45 }}
          className="mt-6 md:mt-8 text-xs text-muted-foreground/70 hover:text-primary underline underline-offset-4 transition-colors duration-300 cursor-pointer"
        >
          לא בטוחים מה מתאים לכם? ענו על 3 שאלות קצרות
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default LandingHero;
