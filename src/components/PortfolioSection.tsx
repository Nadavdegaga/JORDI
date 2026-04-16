import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import GoldDivider from "./GoldDivider";
import { Shield, Swords, Landmark, HardHat, Truck, HeartPulse } from "lucide-react";
import dubaiSkyline from "@/assets/hero-emirates-fog.jpg";

const sectors = [
  { icon: Shield, label: "AI Cybersecurity", insight: "The UAE's enterprise sector is investing heavily in cyber defense infrastructure, creating a $1.5B+ market for AI-driven threat detection and data protection solutions." },
  { icon: Swords, label: "AI Defense", insight: "With the UAE emerging as a top global defense spender, autonomous systems and AI-powered intelligence platforms represent significant commercial opportunities." },
  { icon: Landmark, label: "AI Fintech", insight: "Dubai's DIFC and ADGM are positioning as global fintech hubs, driving demand for AI-powered compliance, fraud detection, and Islamic finance automation." },
  { icon: HardHat, label: "AI Construction", insight: "Mega-projects across the UAE demand AI-driven project management, predictive maintenance, and smart building technologies at unprecedented scale." },
  { icon: Truck, label: "AI Logistics", insight: "As a global trade hub connecting East and West, the UAE requires next-generation AI logistics for ports, free zones, and last-mile delivery optimization." },
  { icon: HeartPulse, label: "AI Healthtech", insight: "The UAE's world-class healthcare infrastructure is accelerating adoption of AI diagnostics, personalized medicine, and hospital automation." },
];

const PortfolioSection = () => {
  const sectionRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} className="section-darker relative overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={dubaiSkyline}
          alt=""
          className="w-full h-[120%] object-cover object-[center_40%]"
          style={{
            y: bgY,
            filter: "saturate(0.6) brightness(0.3)",
          }}
        />
        <div className="absolute inset-0 bg-[#050607]/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/70" />
      </div>

      <div className="relative z-10 section-padding">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-label text-primary mb-4 text-center">
              Commercial Portfolio
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <h2 className="heading-section text-center text-foreground mb-6">
              AI <span className="text-gradient-gold">Verticals</span>
            </h2>
          </AnimatedSection>

          <GoldDivider />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-16">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              const isHovered = hoveredIndex === index;
              return (
                <AnimatedSection key={index} delay={0.1 + index * 0.08}>
                  <div
                    className="group relative flex flex-col items-center p-8 md:p-10 rounded-lg border border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40 backdrop-blur-sm transition-all duration-700 cursor-default min-h-[180px]"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <AnimatePresence mode="wait">
                      {!isHovered ? (
                        <motion.div
                          key="icon"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center mb-5 group-hover:border-primary/50 group-hover:glow-gold transition-all duration-700">
                            <Icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-500" />
                          </div>
                          <p className="text-label text-foreground/80 text-center text-xs group-hover:text-foreground transition-colors duration-500">
                            {sector.label}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="insight"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center justify-center h-full"
                        >
                          <p className="text-label text-primary mb-3 text-xs">{sector.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed text-center">
                            {sector.insight}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection delay={0.6}>
            <p className="text-body text-muted-foreground text-center mt-12 text-sm italic">
              Focused on high-growth, institutional-grade AI applications.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
