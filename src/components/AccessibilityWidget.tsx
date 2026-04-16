import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accessibility, X, ZoomIn, ZoomOut, Contrast, 
  MousePointerClick, Type, RotateCcw, Eye, Pause
} from "lucide-react";

interface A11yState {
  fontSize: number; // 0 = normal, 1 = large, 2 = largest
  highContrast: boolean;
  reduceMotion: boolean;
  highlightLinks: boolean;
  largeCursor: boolean;
  readableFont: boolean;
}

const defaultState: A11yState = {
  fontSize: 0,
  highContrast: false,
  reduceMotion: false,
  highlightLinks: false,
  largeCursor: false,
  readableFont: false,
};

const fontSizeLabels = ["רגיל", "גדול", "גדול מאוד"];
const fontSizeClasses = ["a11y-font-normal", "a11y-font-large", "a11y-font-largest"];

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<A11yState>(() => {
    try {
      const saved = localStorage.getItem("a11y-settings");
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  const applySettings = useCallback((s: A11yState) => {
    const root = document.documentElement;
    
    // Font size
    fontSizeClasses.forEach(c => root.classList.remove(c));
    root.classList.add(fontSizeClasses[s.fontSize]);

    // High contrast
    root.classList.toggle("a11y-high-contrast", s.highContrast);

    // Reduce motion
    root.classList.toggle("a11y-reduce-motion", s.reduceMotion);

    // Highlight links
    root.classList.toggle("a11y-highlight-links", s.highlightLinks);

    // Large cursor
    root.classList.toggle("a11y-large-cursor", s.largeCursor);

    // Readable font
    root.classList.toggle("a11y-readable-font", s.readableFont);
  }, []);

  useEffect(() => {
    applySettings(state);
    localStorage.setItem("a11y-settings", JSON.stringify(state));
  }, [state, applySettings]);

  const update = (partial: Partial<A11yState>) => {
    setState(prev => ({ ...prev, ...partial }));
  };

  const reset = () => {
    setState(defaultState);
  };

  const increaseFontSize = () => {
    setState(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 1, 2) }));
  };

  const decreaseFontSize = () => {
    setState(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 1, 0) }));
  };

  const hasChanges = JSON.stringify(state) !== JSON.stringify(defaultState);

  return (
    <>
      {/* Trigger button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border border-primary/30 bg-background/80 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/60 transition-all duration-500 shadow-lg shadow-primary/10 cursor-pointer"
        aria-label="תפריט נגישות"
      >
        <Accessibility className="w-5 h-5" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 bg-card border border-border/50 rounded-xl shadow-2xl shadow-primary/5 overflow-hidden backdrop-blur-md bottom-20 right-6 w-72 sm:w-72 max-[640px]:left-4 max-[640px]:right-4 max-[640px]:w-auto max-[640px]:bottom-20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">נגישות</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="סגור תפריט נגישות"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Font size */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">גודל טקסט: {fontSizeLabels[state.fontSize]}</p>
                <div className="flex gap-2">
                  <button
                    onClick={decreaseFontSize}
                    disabled={state.fontSize === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border/40 bg-card/50 text-xs text-foreground hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                    הקטן
                  </button>
                  <button
                    onClick={increaseFontSize}
                    disabled={state.fontSize === 2}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border/40 bg-card/50 text-xs text-foreground hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    הגדל
                  </button>
                </div>
              </div>

              {/* Toggle buttons */}
              <ToggleButton
                icon={Contrast}
                label="ניגודיות גבוהה"
                active={state.highContrast}
                onClick={() => update({ highContrast: !state.highContrast })}
              />
              <ToggleButton
                icon={Pause}
                label="השבת אנימציות"
                active={state.reduceMotion}
                onClick={() => update({ reduceMotion: !state.reduceMotion })}
              />
              <ToggleButton
                icon={Eye}
                label="הדגש קישורים"
                active={state.highlightLinks}
                onClick={() => update({ highlightLinks: !state.highlightLinks })}
              />
              <ToggleButton
                icon={MousePointerClick}
                label="סמן גדול"
                active={state.largeCursor}
                onClick={() => update({ largeCursor: !state.largeCursor })}
              />
              <ToggleButton
                icon={Type}
                label="גופן קריא"
                active={state.readableFont}
                onClick={() => update({ readableFont: !state.readableFont })}
              />

              {/* Reset */}
              {hasChanges && (
                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 py-2 mt-2 rounded-lg border border-primary/20 text-xs text-primary hover:bg-primary/10 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  איפוס הגדרות
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ToggleButton = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg border text-xs transition-all cursor-pointer ${
      active
        ? "border-primary/40 bg-primary/10 text-primary"
        : "border-border/30 bg-card/30 text-foreground/70 hover:border-primary/20"
    }`}
  >
    <Icon className="w-4 h-4 shrink-0" />
    <span className="flex-1 text-right">{label}</span>
    <div className={`w-8 h-4 rounded-full transition-all ${active ? "bg-primary" : "bg-muted"}`}>
      <div className={`w-3 h-3 rounded-full bg-foreground mt-0.5 transition-all ${active ? "ml-[18px]" : "ml-0.5"}`} />
    </div>
  </button>
);

export default AccessibilityWidget;
