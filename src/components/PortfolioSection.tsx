import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import GoldDivider from "./GoldDivider";
import { Zap, Smartphone, Link2, Bot, BarChart3, Globe } from "lucide-react";
import dubaiSkyline from "@/assets/chess-strategy.jpg";

const sectors = [
  { icon: Zap, label: "אוטומציות עסקיות", insight: "חיבור מערכות, אוטומציית תהליכים, העברת מידע אוטומטית בין פלטפורמות — כל מה שחוסך עבודה ידנית חוזרת ומייעל את העסק שלכם." },
  { icon: Smartphone, label: "אפליקציות מותאמות", insight: "פיתוח אפליקציות ווב ומובייל מותאמות אישית — דשבורדים, מערכות CRM, כלי ניהול פרויקטים וכל מה שהעסק שלכם צריך." },
  { icon: Link2, label: "אינטגרציות ו-API", insight: "חיבור בין WhatsApp, Gmail, Google Calendar, מערכות הנהלת חשבונות ועוד — הכל מדבר עם הכל בצורה חלקה." },
  { icon: Bot, label: "פתרונות AI", insight: "ניתוח מסמכים אוטומטי, עיבוד טקסט חכם, צ׳אטבוטים ופתרונות מבוססי בינה מלאכותית שמייעלים את העבודה." },
  { icon: BarChart3, label: "דשבורדים וניהול", insight: "מסכי ניהול מרכזיים שמרכזים את כל הנתונים שלכם במקום אחד — קבלת החלטות מבוססת דאטה בזמן אמת." },
  { icon: Globe, label: "פתרונות דיגיטליים", insight: "אתרים, דפי נחיתה, חנויות מקוונות ופתרונות דיגיטליים מקצה לקצה שמביאים תוצאות עסקיות." },
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
              תחומי ההתמחות
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <h2 className="heading-section text-center text-foreground mb-6">
              מה אנחנו <span className="text-gradient-gold">עושים</span>
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
              פתרונות מותאמים אישית לכל סוג של עסק.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;