import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "opportunity", label: "Opportunity" },
  { id: "what-is", label: "What Is RoyalX" },
  { id: "framework", label: "Framework" },
  { id: "portfolio", label: "Portfolio" },
  { id: "leadership", label: "Leadership" },
  { id: "closing", label: "Contact" },
];

const TableOfContents = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show TOC after scrolling past hero
      setIsVisible(window.scrollY > window.innerHeight * 0.5);

      // Determine active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3"
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group flex items-center gap-3 cursor-pointer"
          >
            <span
              className={`text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${
                isActive
                  ? "text-primary opacity-100"
                  : "text-muted-foreground/0 group-hover:text-muted-foreground/70 opacity-0 group-hover:opacity-100"
              }`}
            >
              {section.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-500 ${
                isActive
                  ? "w-2.5 h-2.5 bg-primary glow-gold"
                  : "w-1.5 h-1.5 bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
              }`}
            />
          </button>
        );
      })}
    </motion.nav>
  );
};

export default TableOfContents;
