import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ContactDialog from "./ContactDialog";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-primary/90 hover:bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg shadow-primary/20 transition-all duration-500 cursor-pointer group"
        aria-label="בואו נדבר"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-label text-xs tracking-[0.15em]">בואו נדבר</span>
      </motion.button>

      <ContactDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default FloatingContact;
