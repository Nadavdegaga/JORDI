import { useEffect, useState } from "react";
import GrainOverlay from "@/components/GrainOverlay";
import ScrollProgressLine from "@/components/ScrollProgressLine";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import LandingHero from "@/components/landing/LandingHero";
import PainSection from "@/components/landing/PainSection";
import ServicesSection from "@/components/landing/ServicesSection";
import PricingSection from "@/components/landing/PricingSection";
import ProcessSection from "@/components/landing/ProcessSection";
import FaqSection from "@/components/landing/FaqSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import StickyCta from "@/components/landing/StickyCta";
import LandingFooter from "@/components/landing/LandingFooter";
import QualifierDialog from "@/components/landing/QualifierDialog";
import { captureAttribution } from "@/lib/attribution";
import { initPixel } from "@/lib/pixel";
import { useScrollDepthTracking, useTimeOnPageTracking } from "@/hooks/useFunnelTracking";

const PAGE_TITLE = "PitStop Automations — אוטומציה שחוסכת לעסק שלכם שעות בכל שבוע";
const PAGE_DESCRIPTION =
  "אוטומציות, מערכות ניהול ואינטגרציות מותאמות אישית לעסקים. מחירים שקופים, שיחת אפיון ללא עלות ומענה תוך 24 שעות.";

/**
 * Campaign landing page (/lp).
 *
 * Deliberately isolated from the main site: no nav, no competing links, one
 * conversion action repeated down the page. Attribution is captured and the
 * pixel initialized before anything renders, so a visitor who converts in the
 * first few seconds is still tracked correctly.
 */
const Landing = () => {
  const [qualifierOpen, setQualifierOpen] = useState(false);

  useScrollDepthTracking();
  useTimeOnPageTracking(30);

  useEffect(() => {
    captureAttribution();
    initPixel();
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", PAGE_DESCRIPTION);

    // Campaign traffic only: this page must never surface in search results
    // alongside the main site. The X-Robots-Tag header in vercel.json is the
    // primary control (it works without JS); this tag covers crawlers that
    // render the DOM instead of reading headers.
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      meta?.setAttribute("content", previousDescription);
      robots.remove();
    };
  }, []);

  const openQualifier = () => setQualifierOpen(true);

  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <GrainOverlay />
      <ScrollProgressLine />

      <LandingHero onQualify={openQualifier} />
      <PainSection />
      <ServicesSection />
      <PricingSection />
      <ProcessSection />
      <FaqSection />
      <FinalCtaSection onQualify={openQualifier} />
      <LandingFooter />

      <StickyCta />
      <QualifierDialog open={qualifierOpen} onOpenChange={setQualifierOpen} />
      <AccessibilityWidget />
    </main>
  );
};

export default Landing;
