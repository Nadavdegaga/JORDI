import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeadCta from "./LeadCta";

/**
 * Persistent conversion bar. Campaign traffic is mostly mobile and mostly
 * one-handed — the CTA has to stay reachable without scrolling back up.
 * Hidden over the hero so it doesn't compete with the primary CTA there.
 */
const StickyCta = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lets the accessibility button lift above the bar instead of overlapping it.
  useEffect(() => {
    document.body.classList.toggle("has-sticky-cta", visible);
    return () => document.body.classList.remove("has-sticky-cta");
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 inset-x-0 z-40 border-t border-primary/20 bg-background/95 backdrop-blur-md px-4 py-3 md:hidden"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">שיחת אפיון ללא עלות</p>
              <p className="text-[11px] text-muted-foreground truncate">30 דקות, בלי התחייבות</p>
            </div>
            <LeadCta label="לוואטסאפ" source="sticky_bar" className="!px-5 !py-2.5 shrink-0" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCta;
