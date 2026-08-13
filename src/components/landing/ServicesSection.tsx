import { Zap, LayoutDashboard, Link2, Bot } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GoldDivider from "@/components/GoldDivider";
import { SERVICES } from "@/config/landing";
import { useSectionTracking } from "@/hooks/useFunnelTracking";

const icons = [Zap, LayoutDashboard, Link2, Bot];

const ServicesSection = () => {
  const ref = useSectionTracking<HTMLElement>("services");

  return (
    <section ref={ref} id="services" className="section-padding section-darker">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <p className="text-label text-primary mb-4 text-center">מה אנחנו בונים</p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="heading-section text-center text-foreground mb-6">
            ארבעה סוגי <span className="text-gradient-gold">פתרונות בהתאמה אישית</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <p className="text-body text-muted-foreground text-center max-w-2xl mx-auto text-sm">
            לא תבניות מוכנות. כל פתרון נבנה סביב התהליכים שכבר קיימים אצלכם.
          </p>
        </AnimatedSection>

        <GoldDivider />

        <div className="space-y-4 mt-14">
          {SERVICES.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <AnimatedSection key={service.name} delay={0.12 + index * 0.1}>
                <div className="group flex flex-col md:flex-row gap-5 md:gap-8 p-7 md:p-9 rounded-lg border border-border/40 bg-card/30 hover:border-primary/25 transition-all duration-700">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full border border-primary/25 flex items-center justify-center group-hover:border-primary/50 group-hover:glow-gold transition-all duration-500">
                      <Icon className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors duration-500" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-medium text-foreground mb-3">{service.name}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                      {service.body}
                    </p>
                    <p className="text-xs md:text-sm text-primary/70 leading-relaxed border-r-2 border-primary/25 pr-4">
                      {service.example}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
