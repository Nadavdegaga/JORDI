import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import TextReveal from "./TextReveal";
import ContactDialog from "./ContactDialog";
import heroGlobe from "@/assets/geo-sphere.jpg";

const ClosingSection = () => {
  const lineRef = useRef(null);
  const isInView = useInView(lineRef, { once: true, margin: "-80px" });
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <section className="relative overflow-hidden">
      {/* Contact / CTA area */}
      <div className="section-padding py-32 md:py-40 relative">
        {/* Globe background */}
        <div className="absolute inset-0">
          <img
            src={heroGlobe}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "saturate(0.7) brightness(0.55)" }}
          />
          <div className="absolute inset-0 bg-[#050607]/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="heading-display text-foreground mb-2">
            <TextReveal>אוטומציה.</TextReveal>
          </h2>
          <h2 className="heading-display text-gradient-gold mb-2">
            <TextReveal delay={0.25}>התאמה.</TextReveal>
          </h2>
          <h2 className="heading-display text-foreground mb-10">
            <TextReveal delay={0.5}>צמיחה.</TextReveal>
          </h2>

          <div ref={lineRef} className="flex justify-center mb-10">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: 120 } : { width: 0 }}
              transition={{ duration: 1.5, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-px bg-gradient-gold"
            />
          </div>

          <AnimatedSection delay={0.8}>
            <p className="text-body text-muted-foreground max-w-xl mx-auto mb-16">
              יש לכם רעיון? תהליך שרוצים לייעל? מוצר שרוצים לבנות? ספרו לנו ונחזור אליכם תוך 24 שעות.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button
                onClick={() => setShowContact(true)}
                className="inline-block text-label text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/40 px-8 py-4 rounded transition-all duration-700 cta-glow tracking-[0.3em] cursor-pointer"
              >
                בואו נדבר
              </button>
              <Link
                to="/business-brief"
                className="inline-block text-label text-primary-foreground bg-primary/80 hover:bg-primary px-8 py-4 rounded transition-all duration-700 cta-glow tracking-[0.3em]"
              >
                ניתוח עסקי מהיר
              </Link>
            </div>
          </AnimatedSection>

          {/* Contact info */}
          <AnimatedSection delay={1.1}>
            <div className="flex items-center justify-center gap-5 mb-8">
              <a href="mailto:tayaryardenn@gmail.com" className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-500" aria-label="אימייל">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground/50">📧 tayaryardenn@gmail.com &nbsp;|&nbsp; 📍 ישראל</p>
          </AnimatedSection>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-[#030405] border-t border-border/20">
        <div className="max-w-6xl mx-auto px-6 py-10 pb-20 md:pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
            {/* Brand */}
            <div>
              <p className="font-serif text-xl text-foreground tracking-[0.02em] mb-3">PitStop Automation</p>
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                אנחנו בונים מערכות אוטומציה, אפליקציות ופתרונות דיגיטליים מותאמים אישית שחוסכים לכם זמן, כסף וכאב ראש.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-label text-xs text-muted-foreground/40 mb-4">ניווט</p>
              <ul className="space-y-2">
                {[
                  { label: "שירותים", href: "#services" },
                  { label: "תהליך עבודה", href: "#framework" },
                  { label: "תחומי התמחות", href: "#portfolio" },
                  { label: "הצוות", href: "#leadership" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link to="/business-brief" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500">
                    ניתוח עסקי מהיר
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-label text-xs text-muted-foreground/40 mb-4">משפטי</p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setShowTerms(true)} className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500 cursor-pointer">
                    תנאי שימוש
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowPrivacy(true)} className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500 cursor-pointer">
                    מדיניות פרטיות
                  </button>
                </li>
                <li>
                  <a href="mailto:tayaryardenn@gmail.com" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500">
                    צור קשר
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-muted-foreground/40 tracking-widest uppercase">
              © {new Date().getFullYear()} PitStop Automation — כל הזכויות שמורות
            </p>
            <p className="text-[10px] text-muted-foreground/30">
              אתר זה אינו מהווה ייעוץ פיננסי, משפטי או השקעתי.
            </p>
          </div>
        </div>
      </footer>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setShowTerms(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative bg-card border border-border/50 rounded-xl p-8 md:p-10 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-2xl text-foreground mb-6">תנאי שימוש</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>ברוכים הבאים לאתר שלנו. השימוש באתר ובשירותים שלנו כפוף לתנאים הבאים. בשימוש באתר, אתם מסכימים לתנאים אלו.</p>
              <p><strong className="text-foreground/80">1. השירותים.</strong> אנו מספקים שירותי פיתוח תוכנה, אוטומציה עסקית, אינטגרציות ופתרונות דיגיטליים מותאמים אישית. היקף השירות המדויק, לוחות הזמנים והתמחור ייקבעו בהסכם נפרד.</p>
              <p><strong className="text-foreground/80">2. קניין רוחני.</strong> כל התכנים באתר, כולל עיצוב, טקסטים, לוגו וגרפיקה, הם רכושנו ומוגנים בזכויות יוצרים. קוד ומערכות שפותחו עבור לקוחות יהיו בבעלותם בכפוף לתנאי ההסכם.</p>
              <p><strong className="text-foreground/80">3. הגבלת אחריות.</strong> השירותים ניתנים כפי שהם. איננו אחראים לנזקים עקיפים או תוצאתיים הנובעים משימוש בשירותים, מעבר למה שנקבע בהסכם השירות.</p>
              <p><strong className="text-foreground/80">4. סודיות.</strong> אנו מתחייבים לשמור בסודיות מוחלטת על כל מידע עסקי או אישי שנחשף לנו במסגרת מתן השירות.</p>
              <p><strong className="text-foreground/80">5. ביטולים.</strong> תנאי ביטול ייקבעו בהסכם השירות הספציפי. באופן כללי, ביטול פרויקט בתהליך עבודה יחייב תשלום עבור העבודה שבוצעה עד למועד הביטול.</p>
              <p><strong className="text-foreground/80">6. דין ושיפוט.</strong> תנאים אלו כפופים לחוקי מדינת ישראל. סמכות השיפוט הבלעדית תהיה לבתי המשפט המוסמכים במחוז המרכז.</p>
            </div>
            <button onClick={() => setShowTerms(false)} className="mt-6 text-label text-xs text-muted-foreground/50 hover:text-primary tracking-[0.2em] transition-colors cursor-pointer">סגור</button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setShowPrivacy(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative bg-card border border-border/50 rounded-xl p-8 md:p-10 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-2xl text-foreground mb-6">מדיניות פרטיות</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>אנו מכבדים את פרטיותכם ומחויבים להגן על המידע האישי שלכם. מדיניות זו מסבירה כיצד אנו אוספים, משתמשים ומגינים על המידע שלכם.</p>
              <p><strong className="text-foreground/80">1. מידע שאנו אוספים.</strong> אנו עשויים לאסוף מידע אישי שאתם מספקים ישירות דרך טופס יצירת קשר: שם, אימייל, טלפון ופרטי הפנייה. כמו כן מידע טכני שנאסף אוטומטית.</p>
              <p><strong className="text-foreground/80">2. שימוש במידע.</strong> המידע משמש לספק ולשפר את שירותינו, ליצור עמכם קשר בתגובה לפנייתכם, ולעמוד בדרישות חוקיות.</p>
              <p><strong className="text-foreground/80">3. אבטחת מידע.</strong> אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע שלכם מפני גישה בלתי מורשית.</p>
              <p><strong className="text-foreground/80">4. עוגיות.</strong> האתר עשוי להשתמש בעוגיות לצורך שיפור חוויית הגלישה. תוכלו לשלוט בהגדרות העוגיות דרך הדפדפן שלכם.</p>
              <p><strong className="text-foreground/80">5. שיתוף מידע.</strong> איננו מוכרים את המידע האישי שלכם. אנו עשויים לשתף מידע עם ספקי שירות הפועלים מטעמנו ומחויבים לשמור על סודיות.</p>
              <p><strong className="text-foreground/80">6. זכויותיכם.</strong> הינכם זכאים לעיין במידע שנשמר אודותיכם, לבקש תיקון או מחיקת מידע, ולהתנגד לשימוש במידע לצורכי שיווק.</p>
              <p><strong className="text-foreground/80">7. יצירת קשר.</strong> לשאלות בנוגע למדיניות פרטיות זו, פנו אלינו: tayaryardenn@gmail.com</p>
            </div>
            <button onClick={() => setShowPrivacy(false)} className="mt-6 text-label text-xs text-muted-foreground/50 hover:text-primary tracking-[0.2em] transition-colors cursor-pointer">סגור</button>
          </div>
        </div>
      )}

      <ContactDialog open={showContact} onOpenChange={setShowContact} />
    </section>
  );
};

export default ClosingSection;