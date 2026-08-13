/**
 * Behavioral tracking for the landing page funnel.
 *
 * Scroll depth and section visibility are what tell you *where* campaign
 * traffic drops off — and they double as the custom events Meta uses to build
 * retargeting audiences of people who nearly converted.
 */

import { useEffect, useRef } from "react";
import { trackCustom } from "@/lib/pixel";

const DEPTH_MILESTONES = [25, 50, 75, 90] as const;

/** Fires ScrollDepth events once per milestone per pageview. */
export const useScrollDepthTracking = (): void => {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    let ticking = false;

    const measure = () => {
      ticking = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = (window.scrollY / scrollable) * 100;

      DEPTH_MILESTONES.forEach((milestone) => {
        if (percent >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone);
          trackCustom("ScrollDepth", { depth: milestone });
        }
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
};

/**
 * Fires a SectionView event the first time a section is at least half visible.
 * Attach the returned ref to the section element.
 */
export const useSectionTracking = <T extends HTMLElement>(sectionName: string) => {
  const ref = useRef<T>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          trackCustom("SectionView", { section: sectionName });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionName]);

  return ref;
};

/**
 * Fires EngagedVisitor once a visitor has stayed past the given threshold.
 * A cheap, reliable quality signal — bounced ad clicks never reach it.
 */
export const useTimeOnPageTracking = (seconds = 30): void => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      trackCustom("EngagedVisitor", { seconds });
    }, seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);
};
