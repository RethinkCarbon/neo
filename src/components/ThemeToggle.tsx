import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const toolbarBtn =
  "h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 rounded-xl border border-border/60 bg-accent/25 text-muted-foreground shadow-sm shadow-black/5 hover:text-foreground hover:bg-accent/55 hover:border-border/80 hover:shadow-md hover:shadow-black/10 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]";

const defaultBtn =
  "h-9 w-9 rounded-xl border border-border/60 bg-accent/20 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]";

export function ThemeToggle({
  className,
  collapsed,
  toolbar,
}: {
  className?: string;
  collapsed?: boolean;
  /** Larger 40×40 control for dashboard header toolbars */
  toolbar?: boolean;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const iconClass = toolbar ? "h-5 w-5" : "h-4 w-4";

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-xl bg-accent/40 animate-pulse",
          toolbar ? "h-10 w-10 min-h-[40px] min-w-[40px]" : "h-9 w-9",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            toolbar ? toolbarBtn : defaultBtn,
            collapsed && !toolbar && "w-full",
            className,
          )}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className={iconClass} strokeWidth={2} /> : <Moon className={iconClass} strokeWidth={2} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {theme === "system" ? `Theme: system (${resolvedTheme})` : isDark ? "Dark mode" : "Light mode"}
      </TooltipContent>
    </Tooltip>
  );
}
