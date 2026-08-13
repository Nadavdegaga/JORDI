import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { openWhatsApp } from "@/lib/whatsapp";
import { trackCustom, trackStandard } from "@/lib/pixel";

/**
 * Three taps before the WhatsApp handoff.
 *
 * Purpose is lead quality: the answers arrive inside the first WhatsApp
 * message, so the conversation starts already qualified — and each answer is
 * a pixel event, which lets the campaign optimize toward the segments that
 * actually buy rather than toward whoever clicks.
 */

const STEPS = [
  {
    key: "need",
    label: "מה הכי מעניין אתכם",
    question: "מה הכי מעניין אתכם?",
    options: [
      "לאוטמט תהליך שגוזל זמן",
      "מערכת ניהול / דשבורד לעסק",
      "לחבר בין מערכות קיימות",
      "פיתוח מוצר או אפליקציה",
      "עוד לא יודע — צריך ייעוץ",
    ],
  },
  {
    key: "size",
    label: "גודל העסק",
    question: "כמה אנשים בעסק?",
    options: ["עצמאי", "2–10 עובדים", "11–50 עובדים", "50+ עובדים"],
  },
  {
    key: "budget",
    label: "תקציב משוער",
    question: "מה טווח התקציב שחשבתם עליו?",
    options: ["עד ₪5,000", "₪5,000–15,000", "₪15,000–40,000", "₪40,000+", "עוד לא גיבשנו"],
  },
] as const;

interface QualifierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QualifierDialog = ({ open, onOpenChange }: QualifierDialogProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<{ label: string; value: string }[]>([]);

  const reset = () => {
    setStepIndex(0);
    setAnswers([]);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const finish = (allAnswers: { label: string; value: string }[]) => {
    openWhatsApp({ source: "qualifier", answers: allAnswers });
    handleOpenChange(false);
  };

  const handleSelect = (value: string) => {
    const step = STEPS[stepIndex];
    const next = [...answers, { label: step.label, value }];
    setAnswers(next);
    trackCustom("QualifierStep", { step: step.key, value, step_number: stepIndex + 1 });

    if (stepIndex === STEPS.length - 1) {
      // Every answer collected — a stronger intent signal than a raw CTA click.
      trackStandard("CompleteRegistration", {
        content_name: "qualifier",
        ...Object.fromEntries(next.map((a, i) => [STEPS[i].key, a.value])),
      });
      finish(next);
      return;
    }
    setStepIndex(stepIndex + 1);
  };

  const step = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground text-center">
            שאלה {stepIndex + 1} מתוך {STEPS.length}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center text-sm">
            30 שניות, ואז נמשיך בוואטסאפ עם כל הפרטים כבר בידיים.
          </DialogDescription>
        </DialogHeader>

        <div className="h-px w-full bg-border/50 overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-gradient-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="mt-2"
          >
            <p className="text-base font-medium text-foreground mb-4 text-center">{step.question}</p>
            <div className="space-y-2">
              {step.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="group w-full text-right px-4 py-3.5 rounded-lg border border-border/50 bg-background/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-sm text-foreground/90 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{option}</span>
                  <Check className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => finish(answers)}
          className="mt-1 inline-flex items-center justify-center gap-2 text-xs text-muted-foreground/70 hover:text-primary transition-colors duration-300 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          דלגו — קחו אותי ישר לוואטסאפ
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default QualifierDialog;
