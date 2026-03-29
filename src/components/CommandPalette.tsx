import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  BarChart3,
  Table2,
  Lightbulb,
  Settings,
  Command,
  RefreshCw,
  Moon,
  Sun,
  Download,
} from "lucide-react";
import { toast } from "sonner";

type PaletteAction = {
  id: string;
  label: string;
  icon: React.ElementType;
  keywords?: string;
  run: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const { setTheme, resolvedTheme } = useTheme();

  const actions: PaletteAction[] = useMemo(
    () => [
      {
        id: "dash",
        label: "Go to Dashboard",
        icon: LayoutDashboard,
        keywords: "home overview",
        run: () => navigate("/"),
      },
      {
        id: "channels",
        label: "Go to Channel Comparison",
        icon: BarChart3,
        keywords: "platforms cross",
        run: () => navigate("/channels"),
      },
      {
        id: "campaigns",
        label: "Go to Campaign Details",
        icon: Table2,
        keywords: "table ads",
        run: () => navigate("/campaigns"),
      },
      {
        id: "insights",
        label: "Go to Insights",
        icon: Lightbulb,
        keywords: "ai recommendations",
        run: () => navigate("/insights"),
      },
      {
        id: "settings",
        label: "Go to Settings",
        icon: Settings,
        keywords: "account integrations",
        run: () => navigate("/settings"),
      },
      {
        id: "refresh",
        label: "Refresh dashboard data",
        icon: RefreshCw,
        keywords: "reload sync",
        run: () => toast.success("Data refreshed", { description: "Latest metrics loaded from connected sources." }),
      },
      {
        id: "export",
        label: "Export performance report",
        icon: Download,
        keywords: "csv pdf",
        run: () => toast.success("Export started", { description: "Your report will download when ready." }),
      },
      {
        id: "theme",
        label: resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        keywords: "appearance",
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
    ],
    [navigate, setTheme, resolvedTheme],
  );

  const filtered = actions.filter((a) => {
    const q = query.toLowerCase();
    return (
      a.label.toLowerCase().includes(q) ||
      a.keywords?.toLowerCase().includes(q) ||
      a.id.includes(q)
    );
  });

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const execute = useCallback(
    (action: PaletteAction) => {
      action.run();
      close();
    },
    [close],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, Math.max(0, filtered.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter" && filtered[selected]) {
        e.preventDefault();
        execute(filtered[selected]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selected, filtered, execute]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[61] flex items-start justify-center pt-[18vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg glass-card overflow-hidden shadow-2xl pointer-events-auto"
              style={{ boxShadow: "0 24px 80px -12px hsl(0 0% 0% / 0.55), 0 0 60px -20px hsl(160 84% 39% / 0.12)" }}
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Navigate or run actions…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <kbd className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 rounded border border-border bg-accent/50 hidden sm:inline-block">
                  ESC
                </kbd>
              </div>

              <div className="py-1.5 max-h-72 overflow-y-auto">
                {filtered.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">No matching actions</p>
                )}
                {filtered.map((action, i) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => execute(action)}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      i === selected ? "bg-accent/60 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    }`}
                  >
                    <action.icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span className="text-left flex-1">{action.label}</span>
                    {i === selected && (
                      <kbd className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded border border-border bg-accent/50">↵</kbd>
                    )}
                  </button>
                ))}
              </div>

              <div className="px-4 py-2.5 border-t border-border/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Command className="w-3 h-3" />K command palette
                </span>
                <span>↑↓ navigate</span>
                <span>↵ run</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
