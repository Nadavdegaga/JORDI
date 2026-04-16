import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactDialog = ({ open, onOpenChange }: ContactDialogProps) => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    field: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ title: "שגיאה", description: "נא למלא שם ואימייל", variant: "destructive" });
      return;
    }
    setSending(true);

    // Build mailto with form data
    const subject = encodeURIComponent(`פנייה מ${form.name} - ${form.company || "ללא חברה"}`);
    const body = encodeURIComponent(
      `שם: ${form.name}\nחברה: ${form.company}\nתחום: ${form.field}\nאימייל: ${form.email}\nטלפון: ${form.phone}\n\nהודעה:\n${form.message}`
    );
    window.open(`mailto:tayaryardenn@gmail.com?subject=${subject}&body=${body}`, "_self");

    toast({ title: "תודה!", description: "ההודעה נשלחה בהצלחה" });
    setSending(false);
    onOpenChange(false);
    setForm({ name: "", company: "", field: "", email: "", phone: "", message: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground text-right">בואו נדבר</DialogTitle>
          <DialogDescription className="text-muted-foreground text-right text-sm">
            מלאו את הפרטים ונחזור אליכם בהקדם.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">שם מלא *</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="ישראל ישראלי"
                className="bg-background/50 border-border/40 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">שם החברה</Label>
              <Input
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="שם החברה"
                className="bg-background/50 border-border/40 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">תחום הפעילות</Label>
            <Input
              value={form.field}
              onChange={(e) => handleChange("field", e.target.value)}
              placeholder="למשל: פינטק, לוגיסטיקה, בריאות..."
              className="bg-background/50 border-border/40 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">אימייל *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
                dir="ltr"
                className="bg-background/50 border-border/40 text-sm text-left"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">טלפון</Label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="050-0000000"
                dir="ltr"
                className="bg-background/50 border-border/40 text-sm text-left"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">הודעה</Label>
            <Textarea
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="ספרו לנו על הצורך שלכם..."
              rows={3}
              className="bg-background/50 border-border/40 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full text-label tracking-[0.2em] text-primary-foreground bg-primary/80 hover:bg-primary px-6 py-3 rounded transition-all duration-500 text-sm disabled:opacity-50"
          >
            {sending ? "שולח..." : "שלח הודעה"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
