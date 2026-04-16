import AnimatedSection from "./AnimatedSection";
import GoldDivider from "./GoldDivider";

const services = [
  {
    name: "אוטומציות עסקיות",
    description:
      "חיבור מערכות, אוטומציית תהליכים, העברת מידע אוטומטית בין פלטפורמות — כל מה שחוסך עבודה ידנית חוזרת.",
  },
  {
    name: "אפליקציות מותאמות",
    description:
      "פיתוח אפליקציות ווב ומובייל מותאמות אישית לניהול העבודה שלכם — דשבורדים, מערכות CRM, כלי ניהול פרויקטים ועוד.",
  },
  {
    name: "אינטגרציות ו-API",
    description:
      "חיבור בין WhatsApp, Gmail, Google Calendar, מערכות הנהלת חשבונות ועוד — הכל מדבר עם הכל.",
  },
];

const OpportunitySection = () => {
  return (
    <section id="services" className="section-padding section-dark relative">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-label text-primary mb-4 text-center">
            השירותים שלנו
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="heading-section text-center text-foreground mb-4">
            פתרונות שעובדים בשבילכם
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <p className="text-body text-muted-foreground text-center max-w-2xl mx-auto mb-6">
            כל עסק הוא ייחודי. אנחנו מתאימים את הפתרון בדיוק לצרכים שלכם.
          </p>
        </AnimatedSection>

        <GoldDivider />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16">
          {services.map((service, index) => (
            <AnimatedSection
              key={service.name}
              delay={0.2 + index * 0.15}
              direction={index === 0 ? "left" : index === 2 ? "right" : "up"}
            >
              <div className="group relative p-8 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-700">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-4 tracking-[0.02em]">
                  {service.name}
                </h3>
                <div className="w-8 h-px bg-gradient-gold mb-5" />
                <p className="text-body text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpportunitySection;