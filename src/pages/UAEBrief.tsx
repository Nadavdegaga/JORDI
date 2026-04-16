import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import GrainOverlay from "@/components/GrainOverlay";
import ContactDialog from "@/components/ContactDialog";
import {
  Landmark, Brain, Shield, HeartPulse, Truck, Building2, Zap, ShoppingBag,
  ArrowRight, Loader2, AlertTriangle, TrendingUp, Target, MapPin, ChevronLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const verticals = [
  { id: "automation", label: "אוטומציה עסקית", icon: Zap },
  { id: "apps", label: "אפליקציות", icon: Brain },
  { id: "integrations", label: "אינטגרציות", icon: Shield },
  { id: "ai", label: "פתרונות AI", icon: HeartPulse },
  { id: "dashboards", label: "דשבורדים", icon: Landmark },
  { id: "digital", label: "פתרונות דיגיטליים", icon: Building2 },
  { id: "ecommerce", label: "מסחר אלקטרוני", icon: ShoppingBag },
  { id: "logistics", label: "לוגיסטיקה", icon: Truck },
];

const stages = ["רעיון ראשוני", "מוצר ראשוני", "עסק פעיל", "צמיחה"];
const markets = ["ישראל", "אירופה", "ארה״ב", "אחר"];
const models = ["B2B", "B2C", "שניהם"];
const revenues = ["טרם הכנסות", "₪0–₪50K", "₪50K–₪200K", "₪200K–₪1M", "₪1M+"];

interface BriefData {
  fitSummary: { level: string; reasoning: string };
  marketSize: { tam: string; sam: string; som: string; assumptions: string };
  growthDrivers: string[];
  goToMarket: { step: string; detail: string }[];
  risks: string[];
}

const UAEBrief = () => {
  const { toast } = useToast();
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [step, setStep] = useState<"vertical" | "form" | "loading" | "results">("vertical");
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [showContact, setShowContact] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    website: "",
    stage: "",
    primaryMarket: "",
    businessModel: "",
    revenueRange: "",
    description: "",
  });

  const handleSubmit = async () => {
    if (!form.companyName || !form.stage || !form.primaryMarket || !form.businessModel || !form.description) {
      toast({ title: "נא למלא את כל השדות הנדרשים.", variant: "destructive" });
      return;
    }
    if (form.description.length > 500) {
      toast({ title: "התיאור ארוך מדי. שמרו על 2-3 משפטים.", variant: "destructive" });
      return;
    }

    setStep("loading");

    try {
      const { data, error } = await supabase.functions.invoke("uae-brief", {
        body: { vertical: selectedVertical, ...form },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setBrief(data);
      setStep("results");
    } catch (e: any) {
      console.error(e);
      toast({ title: "שגיאה ביצירת הניתוח. נסו שוב.", variant: "destructive" });
      setStep("form");
    }
  };

  const fitColor = (level: string) => {
    if (level === "High") return "text-green-400";
    if (level === "Medium") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <GrainOverlay />

      {/* Back link */}
      <div className="fixed top-6 right-6 z-40">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-500 text-sm tracking-[0.15em] uppercase">
          אוטומציה עסקית
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-label text-primary mb-6 tracking-[0.3em]"
          >
            ניתוח עסקי מהיר
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="heading-display text-foreground mb-6"
          >
            קבלו ניתוח שוק מותאם אישית תוך <span className="text-gradient-gold">60 שניות.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-body text-muted-foreground max-w-xl mx-auto mb-4"
          >
            ניתוח ברמה גבוהה הכולל גודל שוק, מנועי צמיחה ומסלול כניסה מומלץ.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xs text-muted-foreground/50 tracking-widest uppercase"
          >
            ללא צורך במידע רגיש. התוצאות הן הערכות.
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {/* STEP 1: Vertical selection */}
          {step === "vertical" && (
            <motion.div
              key="vertical"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-label text-primary/60 text-center mb-8 tracking-[0.2em]">בחרו את התחום שלכם</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {verticals.map((v) => {
                  const Icon = v.icon;
                  const isSelected = selectedVertical === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVertical(v.id);
                        setTimeout(() => setStep("form"), 400);
                      }}
                      className={`group relative flex flex-col items-center p-8 rounded-lg border transition-all duration-500 cursor-pointer ${
                        isSelected
                          ? "border-primary/50 bg-card/60"
                          : "border-border/30 bg-card/20 hover:border-primary/30 hover:bg-card/40"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center mb-4 transition-all duration-500 ${
                        isSelected ? "border-primary glow-gold" : "border-primary/20 group-hover:border-primary/50"
                      }`}>
                        <Icon className={`w-5 h-5 transition-colors duration-500 ${
                          isSelected ? "text-primary" : "text-primary/50 group-hover:text-primary"
                        }`} />
                      </div>
                      <p className="text-label text-xs text-foreground/80">{v.label}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Form */}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setStep("vertical")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  ← שנו תחום
                </button>
                <span className="text-label text-primary/60 text-xs">
                  {verticals.find((v) => v.id === selectedVertical)?.label}
                </span>
              </div>

              <div className="space-y-6">
                <InputField label="שם העסק *" value={form.companyName} onChange={(v) => setForm({ ...form, companyName: v })} />
                <InputField label="אתר אינטרנט" value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SelectField label="שלב *" value={form.stage} options={stages} onChange={(v) => setForm({ ...form, stage: v })} />
                  <SelectField label="שוק עיקרי *" value={form.primaryMarket} options={markets} onChange={(v) => setForm({ ...form, primaryMarket: v })} />
                  <SelectField label="מודל עסקי *" value={form.businessModel} options={models} onChange={(v) => setForm({ ...form, businessModel: v })} />
                </div>

                <SelectField label="טווח הכנסות" value={form.revenueRange} options={revenues} onChange={(v) => setForm({ ...form, revenueRange: v })} />

                <div>
                  <label className="text-label text-xs text-muted-foreground mb-2 block">תיאור קצר * (2–3 משפטים)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    maxLength={500}
                    rows={3}
                    className="w-full bg-card/30 border border-border/40 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors duration-500 resize-none"
                    placeholder="ספרו בקצרה מה העסק שלכם עושה..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full text-label tracking-[0.2em] text-primary-foreground bg-primary/90 hover:bg-primary px-8 py-4 rounded-lg transition-all duration-500 cta-glow cursor-pointer"
                >
                  צרו ניתוח עסקי
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Loading */}
          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-6" />
              <p className="text-label text-primary/70 tracking-[0.3em]">מייצרים ניתוח מותאם…</p>
              <p className="text-xs text-muted-foreground/40 mt-3">זה עשוי לקחת עד 30 שניות</p>
            </motion.div>
          )}

          {/* STEP 4: Results */}
          {step === "results" && brief && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <p className="text-label text-primary/60 tracking-[0.3em] mb-2">ניתוח מותאם</p>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-[0.02em]">
                  {form.companyName} — הערכת שוק
                </h2>
                <div className="w-16 h-px bg-gradient-gold mx-auto mt-6" />
              </div>

              <BriefSection title="הערכת התאמה אסטרטגית" icon={Target} delay={0.1}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`font-serif text-3xl font-light ${fitColor(brief.fitSummary.level)}`}>
                    {brief.fitSummary.level}
                  </span>
                  <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">ציון התאמה</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{brief.fitSummary.reasoning}</p>
              </BriefSection>

              <BriefSection title="הערכת גודל שוק" icon={TrendingUp} delay={0.2}>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "TAM", value: brief.marketSize.tam },
                    { label: "SAM", value: brief.marketSize.sam },
                    { label: "SOM", value: brief.marketSize.som },
                  ].map((m) => (
                    <div key={m.label} className="text-center p-4 rounded-lg border border-border/20 bg-card/20">
                      <p className="text-label text-primary/50 text-[10px] mb-2">{m.label}</p>
                      <p className="font-serif text-lg text-foreground">{m.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/60 italic">{brief.marketSize.assumptions}</p>
              </BriefSection>

              <BriefSection title="מנועי צמיחה" icon={Zap} delay={0.3}>
                <ul className="space-y-3">
                  {brief.growthDrivers.map((d, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ChevronLeft className="w-3 h-3 text-primary/50 mt-1.5 shrink-0" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{d}</span>
                    </li>
                  ))}
                </ul>
              </BriefSection>

              <BriefSection title="מסלול כניסה מומלץ" icon={MapPin} delay={0.4}>
                <div className="space-y-6">
                  {brief.goToMarket.map((g, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span className="text-label text-primary/40 text-xs mt-1 shrink-0 w-6">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-serif text-lg text-foreground mb-1">{g.step}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{g.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </BriefSection>

              <BriefSection title="סיכונים ומגבלות" icon={AlertTriangle} delay={0.5}>
                <ul className="space-y-3">
                  {brief.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-2 shrink-0" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </BriefSection>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-16"
              >
                <button
                  onClick={() => setShowContact(true)}
                  className="text-label tracking-[0.2em] text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/40 px-8 py-4 rounded transition-all duration-700 cta-glow cursor-pointer"
                >
                  בואו נדבר
                </button>
              </motion.div>

              <p className="text-[10px] text-muted-foreground/30 text-center mt-16 tracking-widest uppercase leading-relaxed max-w-lg mx-auto">
                ניתוח זה הוא אינדיקטיבי בלבד ואינו מהווה ייעוץ פיננסי, משפטי או השקעתי.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ContactDialog open={showContact} onOpenChange={setShowContact} />
    </main>
  );
};

// Reusable components

const InputField = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div>
    <label className="text-label text-xs text-muted-foreground mb-2 block">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-card/30 border border-border/40 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors duration-500"
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
  <div>
    <label className="text-label text-xs text-muted-foreground mb-2 block">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-card/30 border border-border/40 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-colors duration-500 appearance-none cursor-pointer"
    >
      <option value="">בחרו...</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const BriefSection = ({ title, icon: Icon, delay, children }: { title: string; icon: any; delay: number; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay }}
    className="mb-10 p-8 rounded-lg border border-border/30 bg-card/20"
  >
    <div className="flex items-center gap-3 mb-5">
      <Icon className="w-4 h-4 text-primary/50" />
      <h3 className="text-label text-xs text-primary/70 tracking-[0.2em]">{title}</h3>
    </div>
    {children}
  </motion.div>
);

export default UAEBrief;