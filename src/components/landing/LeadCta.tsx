import { MessageCircle } from "lucide-react";
import { openWhatsApp, type LeadContext } from "@/lib/whatsapp";
import { trackCustom } from "@/lib/pixel";

type Variant = "solid" | "outline";

interface LeadCtaProps extends LeadContext {
  label: string;
  variant?: Variant;
  className?: string;
  showIcon?: boolean;
}

const variants: Record<Variant, string> = {
  solid:
    "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary shadow-lg shadow-primary/20",
  outline:
    "border border-primary/40 text-primary hover:border-primary hover:bg-primary/10 bg-background/40 backdrop-blur-sm",
};

/**
 * Every conversion click on the landing page uses this component, so the
 * pixel event and the attributed WhatsApp handoff can never be forgotten.
 */
const LeadCta = ({
  label,
  variant = "solid",
  className = "",
  showIcon = true,
  ...context
}: LeadCtaProps) => {
  const handleClick = () => {
    trackCustom("CTAClick", { cta: context.source, package: context.packageId });
    openWhatsApp(context);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2.5 rounded-lg px-8 py-4 text-sm font-semibold tracking-[0.05em] transition-all duration-500 cta-glow cursor-pointer ${variants[variant]} ${className}`}
    >
      {showIcon && <MessageCircle className="w-4 h-4 shrink-0" />}
      <span>{label}</span>
    </button>
  );
};

export default LeadCta;
