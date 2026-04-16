import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Facebook, Mail } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import TextReveal from "./TextReveal";
import heroGlobe from "@/assets/hero-globe.jpg";

const ClosingSection = () => {
  const lineRef = useRef(null);
  const isInView = useInView(lineRef, { once: true, margin: "-80px" });
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
            <TextReveal>Precision.</TextReveal>
          </h2>
          <h2 className="heading-display text-gradient-gold mb-2">
            <TextReveal delay={0.25}>Adaptation.</TextReveal>
          </h2>
          <h2 className="heading-display text-foreground mb-10">
            <TextReveal delay={0.5}>Growth.</TextReveal>
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
              RoyalX exists to bridge global innovation with commercial opportunity.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <a
                href="mailto:contact@royalx.ae"
                className="inline-block text-label text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/40 px-8 py-4 rounded transition-all duration-700 cta-glow tracking-[0.3em]"
              >
                Private Introduction
              </a>
              <Link
                to="/uae-brief"
                className="inline-block text-label text-primary-foreground bg-primary/80 hover:bg-primary px-8 py-4 rounded transition-all duration-700 cta-glow tracking-[0.3em]"
              >
                UAE Opportunity Brief
              </Link>
            </div>
          </AnimatedSection>

          {/* Social icons */}
          <AnimatedSection delay={1.1}>
            <div className="flex items-center justify-center gap-5 mb-8">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-500" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-500" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="mailto:contact@royalx.ae" className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-500" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-[#030405] border-t border-border/20">
        <div className="max-w-6xl mx-auto px-6 py-10 pb-20 md:pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
            {/* Brand */}
            <div>
              <p className="font-serif text-xl text-foreground tracking-[0.02em] mb-3">RoyalX</p>
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                Strategic commercial advisory platform enabling cross-border AI expansion into the UAE and GCC markets.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-label text-xs text-muted-foreground/40 mb-4">Navigation</p>
              <ul className="space-y-2">
                {["Opportunity", "Framework", "Portfolio", "Leadership"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500"
                    >
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <Link to="/uae-brief" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500">
                    UAE Opportunity Brief
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-label text-xs text-muted-foreground/40 mb-4">Legal</p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setShowTerms(true)} className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500 cursor-pointer">
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowPrivacy(true)} className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500 cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <a href="mailto:contact@royalx.ae" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-500">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-muted-foreground/40 tracking-widest uppercase">
              © {new Date().getFullYear()} RoyalX.ae — All rights reserved
            </p>
            <p className="text-[10px] text-muted-foreground/30">
              This website does not constitute financial, legal, or investment advice.
            </p>
          </div>
        </div>
      </footer>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setShowTerms(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative bg-card border border-border/50 rounded-xl p-8 md:p-10 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-2xl text-foreground mb-6">Terms of Use</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>Welcome to RoyalX.ae. By accessing or using this website, you agree to be bound by these Terms of Use.</p>
              <p><strong className="text-foreground/80">1. Use of Website.</strong> This website is provided for informational purposes only. The content does not constitute an offer, solicitation, or recommendation for any investment, partnership, or business arrangement.</p>
              <p><strong className="text-foreground/80">2. Intellectual Property.</strong> All content, trademarks, logos, and intellectual property displayed on this website are the property of RoyalX or its licensors. Unauthorized reproduction or distribution is prohibited.</p>
              <p><strong className="text-foreground/80">3. No Advisory Relationship.</strong> Nothing on this website creates a client-advisor, fiduciary, or professional advisory relationship. Any engagement requires separate formal agreements.</p>
              <p><strong className="text-foreground/80">4. Disclaimer.</strong> Information provided is indicative and may not be current or complete. RoyalX makes no warranties regarding the accuracy, completeness, or reliability of any content.</p>
              <p><strong className="text-foreground/80">5. Limitation of Liability.</strong> RoyalX shall not be liable for any direct, indirect, or consequential damages arising from the use of this website.</p>
              <p><strong className="text-foreground/80">6. Governing Law.</strong> These terms are governed by the laws of the United Arab Emirates.</p>
            </div>
            <button onClick={() => setShowTerms(false)} className="mt-6 text-label text-xs text-muted-foreground/50 hover:text-primary tracking-[0.2em] transition-colors cursor-pointer">Close</button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" onClick={() => setShowPrivacy(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative bg-card border border-border/50 rounded-xl p-8 md:p-10 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-2xl text-foreground mb-6">Privacy Policy</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>RoyalX.ae is committed to protecting your privacy. This policy explains how we handle information collected through this website.</p>
              <p><strong className="text-foreground/80">1. Information Collected.</strong> We may collect basic usage data (page views, browser type) through standard analytics. The UAE Opportunity Brief tool collects only the business information you voluntarily provide.</p>
              <p><strong className="text-foreground/80">2. Use of Information.</strong> Any information collected is used solely to improve our services and respond to inquiries. We do not sell or share personal information with third parties for marketing purposes.</p>
              <p><strong className="text-foreground/80">3. Data Security.</strong> We implement industry-standard security measures to protect any information submitted through this website.</p>
              <p><strong className="text-foreground/80">4. Cookies.</strong> This website may use essential cookies to ensure proper functionality. No tracking or advertising cookies are used.</p>
              <p><strong className="text-foreground/80">5. Third-Party Services.</strong> This website may contain links to external sites. We are not responsible for the privacy practices of third-party websites.</p>
              <p><strong className="text-foreground/80">6. Contact.</strong> For privacy-related inquiries, please contact us at contact@royalx.ae.</p>
              <p><strong className="text-foreground/80">7. Updates.</strong> This policy may be updated from time to time. Continued use of the website constitutes acceptance of any changes.</p>
            </div>
            <button onClick={() => setShowPrivacy(false)} className="mt-6 text-label text-xs text-muted-foreground/50 hover:text-primary tracking-[0.2em] transition-colors cursor-pointer">Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ClosingSection;
