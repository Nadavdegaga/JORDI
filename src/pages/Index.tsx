import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import OpportunitySection from "@/components/OpportunitySection";
import WhatIsSection from "@/components/WhatIsSection";
import FrameworkSection from "@/components/FrameworkSection";
import PortfolioSection from "@/components/PortfolioSection";
import LeadershipSection from "@/components/LeadershipSection";
import ClosingSection from "@/components/ClosingSection";
import GrainOverlay from "@/components/GrainOverlay";
import ScrollProgressLine from "@/components/ScrollProgressLine";
import TableOfContents from "@/components/TableOfContents";
import HamburgerNav from "@/components/HamburgerNav";
import AccessibilityWidget from "@/components/AccessibilityWidget";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <GrainOverlay />
      <ScrollProgressLine />
      <HamburgerNav />
      <TableOfContents />
      <div id="hero"><HeroSection /></div>
      <OpportunitySection />
      <div id="what-is"><WhatIsSection /></div>
      <div id="framework"><FrameworkSection /></div>
      <div id="portfolio"><PortfolioSection /></div>
      <div id="leadership"><LeadershipSection /></div>
      <div id="closing"><ClosingSection /></div>

      {/* Floating CTA to UAE Brief */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={() => navigate("/uae-brief")}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full border border-primary/30 bg-background/80 backdrop-blur-md text-primary hover:bg-primary/10 hover:border-primary/60 transition-all duration-500 shadow-lg shadow-primary/10 cursor-pointer group"
      >
        <FileText className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-xs tracking-[0.15em] font-medium uppercase">UAE Brief</span>
      </motion.button>

      <AccessibilityWidget />
    </main>
  );
};

export default Index;
