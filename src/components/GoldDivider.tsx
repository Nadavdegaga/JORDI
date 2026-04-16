import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const GoldDivider = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="flex justify-center py-4">
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={isInView ? { width: 80, opacity: 1 } : { width: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-px bg-gradient-gold"
      />
    </div>
  );
};

export default GoldDivider;
