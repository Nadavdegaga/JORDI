import { useEffect, useRef } from "react";
import { Check, Users } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GoldDivider from "@/components/GoldDivider";
import LeadCta from "./LeadCta";
import { PACKAGES, type Package } from "@/config/landing";
import { trackStandard, trackCustom } from "@/lib/pixel";

const formatPrice = (value: number) => `₪${value.toLocaleString("he-IL")}`;

const PackageCard = ({ pkg, index }: { pkg: Package; index: number }) => (
  <AnimatedSection delay={0.12 + index * 0.12} className="h-full">
    <div
      className={`relative flex flex-col h-full p-7 md:p-8 rounded-xl border transition-all duration-700 ${
        pkg.featured
          ? "border-primary/50 bg-card/60 shadow-lg shadow-primary/10"
          : "border-border/40 bg-card/30 hover:border-primary/25"
      }`}
    >
      {pkg.featured && (
        <span className="absolute -top-3 right-7 bg-gradient-gold text-primary-foreground text-[11px] font-semibold tracking-wider px-3 py-1 rounded-full">
          הכי מבוקש
        </span>
      )}

      <h3 className="text-2xl font-medium text-foreground mb-2">{pkg.name}</h3>
      <p className="text-sm text-muted-foreground mb-6 min-h-[2.5rem]">{pkg.tagline}</p>

      <div className="mb-1">
        <span className="text-xs text-muted-foreground">החל מ־</span>
        <span className="text-4xl font-bold text-gradient-gold mx-1">{formatPrice(pkg.priceFrom)}</span>
      </div>
      <p className="text-xs text-muted-foreground/70 mb-6">{pkg.priceNote}</p>

      <div className="flex flex-col gap-2 pb-6 mb-6 border-b border-border/40">
        <span className="inline-flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
          <Users className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
          {pkg.bestFor}
        </span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
            <Check className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <LeadCta
        label={`מתעניין ב${pkg.name}`}
        source={`pricing_${pkg.id}`}
        packageId={pkg.id}
        packageName={pkg.name}
        value={pkg.priceFrom}
        variant={pkg.featured ? "solid" : "outline"}
        className="w-full"
      />
    </div>
  </AnimatedSection>
);

const PricingSection = () => {
  const ref = useRef<HTMLElement>(null);
  const fired = useRef(false);

  // ViewContent on the pricing block is the single most useful mid-funnel
  // signal: it separates people who priced the service from people who bounced.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          trackStandard("ViewContent", {
            content_name: "pricing",
            content_type: "product_group",
            content_ids: PACKAGES.map((p) => p.id),
            currency: "ILS",
          });
          trackCustom("SectionView", { section: "pricing" });
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="pricing" className="section-padding section-dark">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-label text-primary mb-4 text-center">מחירים</p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="heading-section text-center text-foreground mb-6">
            כמה זה <span className="text-gradient-gold">עולה</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <p className="text-body text-muted-foreground text-center max-w-2xl mx-auto text-sm">
            הטווחים כאן אמיתיים ומבוססים על פרויקטים שאנחנו מבצעים בפועל. המחיר הסופי
            נקבע בשיחת האפיון — ואחריה הוא לא משתנה.
          </p>
        </AnimatedSection>

        <GoldDivider />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-14 items-stretch">
          {PACKAGES.map((pkg, index) => (
            <PackageCard key={pkg.id} pkg={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
