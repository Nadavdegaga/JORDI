import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GoldDivider from "@/components/GoldDivider";
import { FAQ } from "@/config/landing";
import { trackCustom } from "@/lib/pixel";
import { useSectionTracking } from "@/hooks/useFunnelTracking";

const FaqSection = () => {
  const ref = useSectionTracking<HTMLElement>("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    const next = openIndex === index ? null : index;
    setOpenIndex(next);
    // Which objections people open tells you what the ad copy should pre-empt.
    if (next !== null) trackCustom("FaqOpen", { question: FAQ[index].q });
  };

  return (
    <section ref={ref} className="section-padding section-darker">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <p className="text-label text-primary mb-4 text-center">שאלות נפוצות</p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="heading-section text-center text-foreground mb-6">
            מה שכולם <span className="text-gradient-gold">שואלים</span>
          </h2>
        </AnimatedSection>

        <GoldDivider />

        <div className="mt-12 divide-y divide-border/40 border-y border-border/40">
          {FAQ.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 text-right cursor-pointer group"
                >
                  <span className="text-base md:text-lg text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4 text-primary/70" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
