import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImage from "@/assets/dubai-skyline-dusk.jpg";
import TextReveal from "./TextReveal";

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const scrollToContent = () => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "saturate(0.85)" }}
        />
        {/* 60% dark overlay */}
        <div className="absolute inset-0 bg-[#050607]/60" />
        {/* Top-to-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050607]/50 via-transparent to-background" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-label text-primary mb-8 tracking-[0.3em]"
        >
          אוטומציה עסקית
        </motion.p>

        <h1 className="heading-display text-foreground mb-6 tracking-[0.02em]">
          <TextReveal delay={0.6}>הפכו את העסק שלכם</TextReveal>
          <br />
          <TextReveal delay={0.8}>ל</TextReveal>
          <span className="text-gradient-gold"><TextReveal delay={0.9}>מכונה חכמה</TextReveal></span>
        </h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="h-px bg-gradient-gold mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-body text-muted-foreground max-w-xl mx-auto mb-12"
        >
          אנחנו בונים מערכות אוטומציה, אפליקציות ופתרונות דיגיטליים מותאמים
          אישית שחוסכים לכם זמן, כסף וכאב ראש. מהרעיון ועד המוצר — אנחנו מטפלים בהכל.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          onClick={scrollToContent}
          className="text-label text-primary/80 hover:text-primary transition-colors duration-500 cursor-pointer group tracking-[0.3em]"
        >
          מה אנחנו עושים ←
          <motion.span
            className="block mt-3 mx-auto w-px h-8 bg-primary/40 group-hover:bg-primary/70 transition-colors duration-500"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.button>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;