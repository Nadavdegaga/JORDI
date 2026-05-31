import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Send } from "lucide-react";

const PROJECT_TYPES = [
  "דף נחיתה",
  "אתר תדמית",
  "חנות",
  "מערכת סגורה",
  "מערכת ניהול",
  "אוטומציות",
  "תשתית אינטגרטיבית",
  "אחר",
];

const SECTIONS = [
  "Hero / ראש הדף",
  "אודות",
  "שירותים",
  "תהליך",
  "צוות / מנהיגות",
  "גלריה / פורטפוליו",
  "יצירת קשר",
  "Footer",
  "כללי לדף",
  "אחר",
];

const CATEGORIES = [
  { id: "design", label: "🎨 עיצוב" },
  { id: "colors", label: "🌈 צבעים" },
  { id: "content", label: "✍️ תוכן / טקסט" },
  { id: "structure", label: "📐 מבנה הסקשן" },
  { id: "add", label: "➕ הוספת חלק" },
  { id: "remove", label: "➖ הסרת חלק" },
  { id: "bug", label: "🐛 באג" },
  { id: "idea", label: "💡 רעיון" },
];

const PRIORITIES = [
  { id: "must", label: "חובה" },
  { id: "nice", label: "רצוי" },
  { id: "future", label: "רעיון לעתיד" },
];

type NoteItem = {
  section: string;
  section_custom: string;
  category: string;
  priority: string;
  description: string;
};

const emptyNote = (): NoteItem => ({
  section: "",
  section_custom: "",
  category: "design",
  priority: "nice",
  description: "",
});

const Feedback = () => {
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [notes, setNotes] = useState<NoteItem[]>([emptyNote()]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = "Review Your Project";
  }, []);

  const updateNote = (idx: number, patch: Partial<NoteItem>) => {
    setNotes((prev) => prev.map((n, i) => (i === idx ? { ...n, ...patch } : n)));
  };

  const addNote = () => setNotes((p) => [...p, emptyNote()]);
  const removeNote = (idx: number) =>
    setNotes((p) => (p.length === 1 ? p : p.filter((_, i) => i !== idx)));

  const submit = async () => {
    if (!clientName.trim() || !projectName.trim()) {
      toast({ title: "חסרים פרטים", description: "נא למלא שם ושם פרויקט", variant: "destructive" });
      return;
    }
    const valid = notes.filter((n) => n.section && n.description.trim());
    if (valid.length === 0) {
      toast({ title: "אין הערות", description: "נא להוסיף לפחות הערה אחת מלאה", variant: "destructive" });
      return;
    }
    setSending(true);
    const rows = valid.map((n) => ({
      client_name: clientName.trim().slice(0, 100),
      project_name: projectName.trim().slice(0, 150),
      manager_name: projectType || null,
      section: n.section,
      section_custom: n.section === "אחר" ? n.section_custom.slice(0, 150) : null,
      category: n.category,
      priority: n.priority,
      description: n.description.trim().slice(0, 2000),
      status: "new",
    }));
    const { error } = await supabase.from("feedback_items").insert(rows);
    setSending(false);
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "תודה!", description: `נשלחו ${rows.length} הערות` });
    setNotes([emptyNote()]);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-wider">REVIEW YOUR PROJECT</h1>
          <p className="text-muted-foreground">שתפו אותנו במה שצריך לשנות, להוסיף או לשפר</p>
        </header>

        <section className="bg-card/40 border border-border/40 rounded-lg p-6 mb-6 space-y-4">
          <h2 className="text-xl font-bold text-primary mb-2">פרטים</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">שם מלא *</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">שם הפרויקט *</Label>
              <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} maxLength={150} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">סוג הפרויקט</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger><SelectValue placeholder="בחר/י סוג" /></SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">הערות ({notes.length})</h2>
            <Button
              onClick={addNote}
              size="sm"
              className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/30"
            >
              <Plus className="w-4 h-4" /> הוסף הערה נוספת
            </Button>
          </div>

          {notes.map((note, idx) => (
            <div key={idx} className="bg-card/40 border border-border/40 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">הערה #{idx + 1}</span>
                {notes.length > 1 && (
                  <button onClick={() => removeNote(idx)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">סקשן *</Label>
                  <Select value={note.section} onValueChange={(v) => updateNote(idx, { section: v })}>
                    <SelectTrigger><SelectValue placeholder="בחר/י סקשן" /></SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {note.section === "אחר" && (
                    <Input
                      placeholder="פרט/י"
                      value={note.section_custom}
                      onChange={(e) => updateNote(idx, { section_custom: e.target.value })}
                      maxLength={150}
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">עדיפות</Label>
                  <Select value={note.priority} onValueChange={(v) => updateNote(idx, { priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">קטגוריה</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateNote(idx, { category: c.id })}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        note.category === c.id
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-background/40 border-border/40 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">תיאור ההערה *</Label>
                <Textarea
                  value={note.description}
                  onChange={(e) => updateNote(idx, { description: e.target.value })}
                  rows={3}
                  maxLength={2000}
                  placeholder="ספרו במילים שלכם..."
                />
              </div>
            </div>
          ))}
        </section>

        <div className="mt-8 flex justify-center">
          <Button onClick={submit} disabled={sending} size="lg" className="gap-2 min-w-[200px]">
            <Send className="w-4 h-4" />
            {sending ? "שולח..." : "שלח את כל ההערות"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;