import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/config/landing";
import { trackCustom } from "@/lib/pixel";
import { getMainSiteUrl, isCampaignHost } from "@/lib/host";

const linkClass =
  "inline-flex items-center gap-1.5 text-muted-foreground/60 hover:text-primary transition-colors duration-300";

/** Points at the main site, crossing hosts when served from lp.<domain>. */
const MainSiteLink = () => {
  const onClick = () => trackCustom("MainSiteClick", { from: "landing_footer" });
  const label = (
    <>
      <ExternalLink className="w-3.5 h-3.5" />
      לאתר המלא
    </>
  );

  if (isCampaignHost()) {
    return (
      <a href={getMainSiteUrl()} onClick={onClick} className={linkClass}>
        {label}
      </a>
    );
  }

  return (
    <Link to="/" onClick={onClick} className={linkClass}>
      {label}
    </Link>
  );
};

/**
 * Compact footer. The privacy notice is not decoration: the page runs a Meta
 * Pixel, and both Israeli privacy law and Meta's own ad policies require the
 * tracking to be disclosed on the landing page itself.
 */

const PRIVACY = [
  ["מידע שאנו אוספים", "פרטים שאתם מוסרים לנו ביוזמתכם (שם, אימייל, טלפון, תיאור הצורך), וכן מידע טכני שנאסף אוטומטית בזמן הגלישה."],
  ["כלי מדידה ופרסום", "האתר עושה שימוש ב-Meta Pixel של פייסבוק לצורך מדידת ביצועי קמפיינים ופרסום מותאם. הכלי אוסף מידע על הגלישה באתר באמצעות עוגיות. ניתן לחסום עוגיות דרך הגדרות הדפדפן."],
  ["שימוש במידע", "המידע משמש למענה לפנייתכם, לשיפור השירות ולמדידת אפקטיביות הפרסום. איננו מוכרים את המידע האישי שלכם."],
  ["זכויותיכם", "אתם רשאים לעיין במידע שנשמר אודותיכם, לבקש את תיקונו או מחיקתו, ולהתנגד לשימוש בו לצרכי שיווק."],
  ["יצירת קשר", `לכל שאלה בנושא פרטיות: ${CONTACT_EMAIL}`],
] as const;

const TERMS = [
  ["השירותים", "אנו מספקים שירותי פיתוח תוכנה, אוטומציה עסקית, אינטגרציות ופתרונות דיגיטליים. היקף השירות, לוחות הזמנים והתמחור ייקבעו בהסכם נפרד."],
  ["מחירים", "המחירים המוצגים באתר הם מחירי מוצא ואינם מהווים הצעה מחייבת. המחיר הסופי ייקבע בהצעת מחיר פרטנית לאחר שיחת אפיון."],
  ["קניין רוחני", "תכני האתר הם רכושנו. קוד ומערכות שפותחו עבור לקוח יהיו בבעלותו בכפוף לתנאי ההסכם."],
  ["סודיות", "אנו מתחייבים לשמור בסודיות על כל מידע עסקי שנחשף לנו במסגרת מתן השירות."],
  ["דין ושיפוט", "התנאים כפופים לחוקי מדינת ישראל, וסמכות השיפוט הבלעדית נתונה לבתי המשפט במחוז המרכז."],
] as const;

type Doc = { title: string; items: readonly (readonly [string, string])[] };

const LandingFooter = () => {
  const [doc, setDoc] = useState<Doc | null>(null);

  return (
    <footer className="relative z-10 bg-[#030405] border-t border-border/20">
      <div className="max-w-5xl mx-auto px-6 py-10 pb-28 md:pb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-center md:text-right">
            <p className="text-lg text-foreground mb-1">PitStop Automations</p>
            <p className="text-xs text-muted-foreground/60">
              אוטומציות, מערכות ופתרונות דיגיטליים מותאמים אישית · ישראל
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            {/* One-way link: the landing page points at the main site, but the
                main site never links back here. On the campaign subdomain this
                crosses hosts, so it must be a plain anchor — a router Link
                would just re-render the landing page at its own root. */}
            <MainSiteLink />
            <button
              onClick={() => setDoc({ title: "מדיניות פרטיות", items: PRIVACY })}
              className="text-muted-foreground/60 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              מדיניות פרטיות
            </button>
            <button
              onClick={() => setDoc({ title: "תנאי שימוש", items: TERMS })}
              className="text-muted-foreground/60 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              תנאי שימוש
            </button>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground/60 hover:text-primary transition-colors duration-300"
            >
              <Mail className="w-3.5 h-3.5" />
              אימייל
            </a>
          </div>
        </div>

        <p className="mt-8 pt-6 border-t border-border/20 text-[10px] text-muted-foreground/40 text-center tracking-widest">
          © {new Date().getFullYear()} PitStop Automations — כל הזכויות שמורות
        </p>
      </div>

      {doc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" onClick={() => setDoc(null)}>
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
          <div
            className="relative bg-card border border-border/50 rounded-xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl text-foreground mb-6">{doc.title}</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              {doc.items.map(([heading, body]) => (
                <p key={heading}>
                  <strong className="text-foreground/80">{heading}.</strong> {body}
                </p>
              ))}
            </div>
            <button
              onClick={() => setDoc(null)}
              className="mt-6 text-xs text-muted-foreground/50 hover:text-primary tracking-[0.2em] transition-colors cursor-pointer"
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default LandingFooter;
