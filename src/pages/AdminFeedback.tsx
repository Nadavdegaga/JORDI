import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Trash2, Download, RefreshCw } from "lucide-react";

type FeedbackItem = {
  id: string;
  client_name: string;
  project_name: string;
  manager_name: string | null;
  section: string;
  section_custom: string | null;
  category: string;
  priority: string;
  description: string;
  status: string;
  created_at: string;
};

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

const CATEGORY_LABEL: Record<string, string> = {
  design: "🎨 עיצוב",
  colors: "🌈 צבעים",
  content: "✍️ תוכן",
  structure: "📐 מבנה",
  add: "➕ הוספה",
  remove: "➖ הסרה",
  bug: "🐛 באג",
  idea: "💡 רעיון",
};

const PRIORITY_LABEL: Record<string, string> = {
  must: "חובה",
  nice: "רצוי",
  future: "עתיד",
};

const PRIORITY_COLOR: Record<string, string> = {
  must: "bg-red-500/20 text-red-300 border-red-500/30",
  nice: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  future: "bg-muted/40 text-muted-foreground border-border/40",
};

const STATUSES = [
  { id: "new", label: "🆕 חדש" },
  { id: "in_progress", label: "🔧 בעבודה" },
  { id: "done", label: "✅ טופל" },
  { id: "rejected", label: "❌ נדחה" },
];

const AdminFeedback = () => {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [fProject, setFProject] = useState<string>("all");
  const [fType, setFType] = useState<string>("all");
  const [fStatus, setFStatus] = useState<string>("all");
  const [fCategory, setFCategory] = useState<string>("all");
  const [fPriority, setFPriority] = useState<string>("all");
  const [grouped, setGrouped] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("feedback_items")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as FeedbackItem[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    document.title = "Admin · פידבק";
    load();
  }, []);

  const projects = useMemo(
    () => Array.from(new Set(items.map((i) => i.project_name))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (fProject !== "all" && i.project_name !== fProject) return false;
      if (fType !== "all" && i.manager_name !== fType) return false;
      if (fStatus !== "all" && i.status !== fStatus) return false;
      if (fCategory !== "all" && i.category !== fCategory) return false;
      if (fPriority !== "all" && i.priority !== fPriority) return false;
      return true;
    });
  }, [items, fProject, fType, fStatus, fCategory, fPriority]);

  const stats = useMemo(() => {
    const s = { total: filtered.length, new: 0, in_progress: 0, done: 0, rejected: 0 } as Record<string, number>;
    filtered.forEach((i) => (s[i.status] = (s[i.status] || 0) + 1));
    return s;
  }, [filtered]);

  const updateStatus = async (id: string, status: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    const { error } = await supabase.from("feedback_items").update({ status }).eq("id", id);
    if (error) toast({ title: "שגיאה", description: error.message, variant: "destructive" });
  };

  const deleteItem = async (id: string) => {
    if (!confirm("למחוק הערה זו?")) return;
    const { error } = await supabase.from("feedback_items").delete().eq("id", id);
    if (error) return toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const exportCsv = () => {
    const headers = ["תאריך", "לקוח", "פרויקט", "סוג", "סקשן", "קטגוריה", "עדיפות", "סטטוס", "תיאור"];
    const escape = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
    const rows = filtered.map((i) =>
      [
        new Date(i.created_at).toLocaleString("he-IL"),
        i.client_name,
        i.project_name,
        i.manager_name || "",
        i.section + (i.section_custom ? ` (${i.section_custom})` : ""),
        CATEGORY_LABEL[i.category] || i.category,
        PRIORITY_LABEL[i.priority] || i.priority,
        STATUSES.find((s) => s.id === i.status)?.label || i.status,
        i.description,
      ].map(escape).join(","),
    );
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderItem = (i: FeedbackItem) => (
    <div key={i.id} className="bg-card/40 border border-border/40 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-foreground">{i.client_name}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-primary">{i.project_name}</span>
          {i.manager_name && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{i.manager_name}</span>
            </>
          )}
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{new Date(i.created_at).toLocaleString("he-IL")}</span>
        </div>
        <button onClick={() => deleteItem(i.id)} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 border border-primary/20 text-primary">
          {i.section}{i.section_custom ? ` — ${i.section_custom}` : ""}
        </span>
        <span className="px-2 py-1 text-xs rounded-full bg-muted/40 border border-border/40 text-foreground">
          {CATEGORY_LABEL[i.category] || i.category}
        </span>
        <span className={`px-2 py-1 text-xs rounded-full border ${PRIORITY_COLOR[i.priority] || ""}`}>
          {PRIORITY_LABEL[i.priority] || i.priority}
        </span>
      </div>

      <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{i.description}</p>

      <div className="flex items-center gap-2 pt-2 border-t border-border/30">
        <Label className="text-xs text-muted-foreground">סטטוס:</Label>
        <Select value={i.status} onValueChange={(v) => updateStatus(i.id, v)}>
          <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const groups = useMemo(() => {
    if (!grouped) return null;
    const m = new Map<string, FeedbackItem[]>();
    filtered.forEach((i) => {
      const arr = m.get(i.project_name) || [];
      arr.push(i);
      m.set(i.project_name, arr);
    });
    return Array.from(m.entries());
  }, [filtered, grouped]);

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">דשבורד פידבק</h1>
            <p className="text-sm text-muted-foreground mt-1">ניהול פנימי · אינו מקושר מהאתר</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} className="gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> רענן
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
              <Download className="w-3.5 h-3.5" /> ייצוא CSV
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { l: "סה״כ", v: stats.total, c: "text-foreground" },
            { l: "🆕 חדש", v: stats.new || 0, c: "text-primary" },
            { l: "🔧 בעבודה", v: stats.in_progress || 0, c: "text-orange-300" },
            { l: "✅ טופל", v: stats.done || 0, c: "text-green-400" },
            { l: "❌ נדחה", v: stats.rejected || 0, c: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.l} className="bg-card/40 border border-border/40 rounded-lg p-4">
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Managers */}
        <div className="bg-card/40 border border-border/40 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-bold mb-3">מנהלי פרויקטים</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {managers.map((m) => (
              <span key={m.id} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-muted/40 border border-border/40">
                {m.name}
                <button onClick={() => removeManager(m.id)} className="text-muted-foreground hover:text-destructive">
                  ×
                </button>
              </span>
            ))}
            {managers.length === 0 && <span className="text-xs text-muted-foreground">אין מנהלים עדיין</span>}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="שם מנהל חדש"
              value={newManager}
              onChange={(e) => setNewManager(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addManager()}
              className="max-w-xs h-9"
              maxLength={80}
            />
            <Button size="sm" onClick={addManager} className="gap-1">
              <Plus className="w-3.5 h-3.5" /> הוסף
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card/40 border border-border/40 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-6 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">פרויקט</Label>
            <Select value={fProject} onValueChange={setFProject}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                {projects.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">מנהל</Label>
            <Select value={fManager} onValueChange={setFManager}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                {managers.map((m) => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">סטטוס</Label>
            <Select value={fStatus} onValueChange={setFStatus}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">קטגוריה</Label>
            <Select value={fCategory} onValueChange={setFCategory}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">עדיפות</Label>
            <Select value={fPriority} onValueChange={setFPriority}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                {Object.entries(PRIORITY_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">תצוגה</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGrouped((g) => !g)}
              className="h-9 w-full"
            >
              {grouped ? "מקובץ לפי פרויקט" : "רשימה שטוחה"}
            </Button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center text-muted-foreground py-12">טוען...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">אין הערות להצגה</div>
        ) : grouped && groups ? (
          <div className="space-y-8">
            {groups.map(([proj, list]) => (
              <div key={proj}>
                <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                  {proj} <span className="text-xs text-muted-foreground font-normal">({list.length})</span>
                </h3>
                <div className="space-y-3">{list.map(renderItem)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">{filtered.map(renderItem)}</div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;