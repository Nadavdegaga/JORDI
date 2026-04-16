import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "opportunity", label: "Opportunity" },
  { id: "what-is", label: "What Is RoyalX" },
  { id: "framework", label: "Framework" },
  { id: "portfolio", label: "Portfolio" },
  { id: "leadership", label: "Leadership" },
  { id: "closing", label: "Contact" },
];

const HamburgerNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 flex flex-col gap-[5px] cursor-pointer group"
        aria-label="Navigation menu"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          className="block w-6 h-[1.5px] bg-foreground/70 group-hover:bg-primary transition-colors duration-500"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="block w-6 h-[1.5px] bg-foreground/70 group-hover:bg-primary transition-colors duration-500"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          className="block w-6 h-[1.5px] bg-foreground/70 group-hover:bg-primary transition-colors duration-500"
        />
      </button>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6">
              {sections.map((section, i) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => scrollTo(section.id)}
                  className="font-serif text-2xl md:text-3xl font-light text-foreground/70 hover:text-primary transition-colors duration-500 cursor-pointer tracking-[0.02em]"
                >
                  {section.label}
                </motion.button>
              ))}

              {/* Divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                exit={{ width: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-px bg-gradient-gold my-2"
              />

              {/* UAE Brief link */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                onClick={() => { setIsOpen(false); navigate("/uae-brief"); }}
                className="text-label text-primary/70 hover:text-primary tracking-[0.3em] transition-colors duration-500 cursor-pointer border border-primary/20 hover:border-primary/40 px-6 py-3 rounded cta-glow"
              >
                UAE Opportunity Brief
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerNav;
