import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import GoldDivider from "./GoldDivider";
import ceoPhoto from "@/assets/ceo-photo.jpg";
import csoPhoto from "@/assets/cso-photo.jpg";
import advisoryPhoto from "@/assets/advisory-photo.jpg";
import cgoPhoto from "@/assets/cgo-photo.jpg";
import yardenPhoto from "@/assets/yarden-photo.jpg";

const leaders: Person[] = [];

const executives = [
  { role: "שותף מייסד", title: "הנהלה ומו\"פ", name: "ירדן טייר", image: yardenPhoto, imagePos: "center 30%", bio: "מהנדסת תעשייה וניהול עם התמחות בפיתוח מוצר וניהול פרויקטים טכנולוגיים. מובילה את מחלקת המחקר והפיתוח עם ניסיון בבינה עסקית, ניתוח נתונים ופתרונות דיגיטליים מתקדמים." },, image: yardenPhoto, imagePos: "center 30%", bio: "מהנדסת תעשייה וניהול עם התמחות בפיתוח מוצר וניהול פרויקטים טכנולוגיים. מובילה את מחלקת המחקר והפיתוח עם ניסיון בבינה עסקית, ניתוח נתונים ופתרונות דיגיטליים מתקדמים." },
  { role: "שותף מייסד", title: "אסטרטגיה ותפעול", name: "נדב דגגה", image: csoPhoto, imagePos: "center 20%", bio: "בוגר מתמטיקה וכלכלה מאוניברסיטת תל אביב. יזם מנוסה בהרחבת עסקים בינלאומיים מקונספט ועד למובילות שוק. מומחה באסטרטגיות צמיחה ומכירות." },
];

type Person = {
  role: string;
  title?: string;
  name?: string;
  tier?: string;
  image: string | null;
  imagePos?: string;
  bio: string | null;
};

const allMembers: Person[] = [
  ...leaders.map((l) => ({ ...l, title: undefined, name: undefined })),
  ...executives,
];

const LeadershipSection = () => {
  const [activePerson, setActivePerson] = useState<Person | null>(null);

  return (
    <section className="section-padding section-dark">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <p className="text-label text-primary mb-4 text-center">
            הצוות שלנו
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <h2 className="heading-section text-center text-foreground mb-6">
            הנהגה ו<span className="text-gradient-gold">אמון מקצועי</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <p className="text-body text-muted-foreground text-center max-w-xl mx-auto mb-6 text-sm">
            צוות מנוסה שמביא מקצועיות, אמינות וביצוע מדויק.
          </p>
        </AnimatedSection>

        <GoldDivider />

        {/* Principal leadership */}
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 mt-16 mb-12">
          {leaders.map((leader, index) => (
            <AnimatedSection key={index} delay={0.2 + index * 0.15}>
              <div
                className={`group text-center p-8 md:p-10 rounded-lg border bg-card/30 transition-all duration-700 min-w-[200px] ${
                  leader.bio ? "cursor-pointer hover:border-primary/40" : "cursor-default hover:border-primary/30"
                } border-primary/15`}
                onClick={() => leader.bio && setActivePerson(leader as Person)}
              >
                {leader.image ? (
                  <div className="w-16 h-16 rounded-full mx-auto mb-5 overflow-hidden border border-primary/25 group-hover:border-primary/50 transition-colors duration-500">
                    <img src={leader.image} alt={leader.role} className="w-full h-full object-cover object-top" style={{ filter: "saturate(0.85)" }} />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full border border-primary/25 mx-auto mb-5 flex items-center justify-center group-hover:border-primary/50 transition-colors duration-500">
                    <span className="text-primary/50 font-serif text-lg group-hover:text-primary/80 transition-colors duration-500">
                      {leader.role.charAt(0)}
                    </span>
                  </div>
                )}
                <p className="font-serif text-xl text-foreground tracking-[0.02em]">{leader.role}</p>
                {leader.name && <p className="font-serif text-sm text-muted-foreground mt-1">{leader.name}</p>}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Executive row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          {executives.map((exec, index) => (
            <AnimatedSection key={index} delay={0.4 + index * 0.1}>
              <div
                className={`group text-center p-6 rounded-lg border border-border/30 bg-card/20 transition-all duration-700 ${
                  exec.bio ? "cursor-pointer hover:border-primary/30" : "cursor-default hover:border-primary/20"
                }`}
                onClick={() => exec.bio && setActivePerson(exec as Person)}
              >
                {exec.image ? (
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border border-primary/20 group-hover:border-primary/40 transition-colors duration-500">
                    <img src={exec.image} alt={exec.role} className="w-full h-full object-cover" style={{ filter: "saturate(0.85)", objectPosition: exec.imagePos || "center top" }} />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 border border-border/30 flex items-center justify-center group-hover:border-primary/30 transition-colors duration-500">
                    <span className="text-muted-foreground/40 font-serif text-lg">{exec.role.charAt(0)}</span>
                  </div>
                )}
                <p className="text-label text-primary/70 mb-1 text-xs">{exec.role}</p>
                {exec.name && <p className="font-serif text-sm text-foreground mb-1">{exec.name}</p>}
                <p className="text-xs text-muted-foreground">{exec.title}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Expanded bio card overlay */}
      <AnimatePresence>
        {activePerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            onClick={() => setActivePerson(null)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative bg-card border border-border/50 rounded-xl overflow-hidden max-w-xl w-full shadow-2xl shadow-primary/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                {/* Photo side */}
                {activePerson.image && (
                  <div className="md:w-1/3 h-40 md:h-auto relative shrink-0">
                    <img
                      src={activePerson.image}
                      alt={activePerson.role}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: activePerson.imagePos || "center top", filter: "saturate(0.85)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/20 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/40 to-transparent md:hidden" />
                  </div>
                )}

                {/* Content side */}
                <div className="flex-1 p-8 md:p-10">
                  <p className="text-label text-primary tracking-[0.2em] mb-2 text-xs">{activePerson.role}</p>
                  {activePerson.name && (
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-[0.02em] mb-2">
                      {activePerson.name}
                    </h3>
                  )}
                  {activePerson.title && (
                    <p className="text-sm text-muted-foreground/60 mb-6">{activePerson.title}</p>
                  )}
                  <div className="w-10 h-px bg-gradient-gold mb-6" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activePerson.bio}
                  </p>
                  <button
                    onClick={() => setActivePerson(null)}
                    className="mt-8 text-label text-xs text-muted-foreground/50 hover:text-primary tracking-[0.2em] transition-colors duration-500 cursor-pointer"
                  >
                    סגור
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LeadershipSection;