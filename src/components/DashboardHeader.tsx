import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const PAGE_META: Record<
  string,
  { title: string; subtitle: string; titleClassName: string }
> = {
  "/": {
    title: "Dashboard",
    subtitle: "Cross-channel advertising performance at a glance",
    titleClassName: "text-[28px] font-extrabold text-foreground tracking-tight leading-none",
  },
  "/channels": {
    title: "Channel comparison",
    subtitle: "Budget allocation and spend vs revenue across ad platforms",
    titleClassName: "text-2xl font-bold text-foreground tracking-tight",
  },
  "/campaigns": {
    title: "Campaign Details",
    subtitle: "Search, filter, and drill into performance by campaign",
    titleClassName: "text-[28px] font-extrabold text-foreground tracking-tight leading-none",
  },
  "/insights": {
    title: "Insights & Recommendations",
    subtitle: "AI-powered analysis of your advertising performance",
    titleClassName: "text-2xl font-bold text-foreground tracking-tight",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage integrations, account, and preferences",
    titleClassName: "text-2xl font-bold text-foreground tracking-tight",
  },
};

const defaultMeta = PAGE_META["/"];

function initialsFromEmail(email: string | undefined): string {
  if (!email) return "?";
  const local = email.split("@")[0] ?? "";
  if (local.length >= 2) return local.slice(0, 2).toUpperCase();
  return local.slice(0, 1).toUpperCase() || "?";
}

export function DashboardHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const meta = PAGE_META[pathname] ?? defaultMeta;

  const email = user?.email ?? "";
  const displayName = user?.user_metadata?.full_name as string | undefined;
  const initials = initialsFromEmail(email);

  const handleLogout = () => {
    void (async () => {
      await logout();
      toast.success("Signed out", { description: "You have been logged out successfully." });
      navigate("/login", { replace: true });
    })();
  };

  return (
    <header className="flex w-full flex-col">
      {/* Layer 1: Top bar — same horizontal margins as main; aligns with sidebar logo row (lg) */}
      <div className="flex w-full min-h-[64px] shrink-0 items-center justify-between gap-4 border-b border-border/50 lg:min-h-[72px]">
        <div className="min-w-0 flex-1" aria-hidden />
        <nav
          className="flex shrink-0 items-center justify-end gap-3.5 sm:gap-4"
          aria-label="Account and preferences"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 rounded-xl border border-border/60 bg-accent/25 text-muted-foreground shadow-sm shadow-black/5 hover:text-foreground hover:bg-accent/55 hover:border-border/80 hover:shadow-md hover:shadow-black/10 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="text-sm font-semibold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 rounded-xl border border-border/60 bg-accent/25 text-muted-foreground shadow-sm shadow-black/5 hover:text-foreground hover:bg-accent/55 hover:border-border/80 hover:shadow-md hover:shadow-black/10 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
                asChild
              >
                <Link to="/settings" className="inline-flex items-center justify-center" aria-label="Settings">
                  <Settings className="h-5 w-5" strokeWidth={2} />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Settings
            </TooltipContent>
          </Tooltip>

          <ThemeToggle toolbar />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-12 w-12 min-h-[48px] min-w-[48px] shrink-0 rounded-full border border-border/50 flex items-center justify-center text-sm font-bold tracking-tight text-primary bg-gradient-to-br from-primary/35 to-primary/12 shadow-sm shadow-black/10 ring-1 ring-border/40 hover:from-primary/48 hover:to-primary/24 hover:ring-border/70 hover:shadow-md hover:shadow-black/15 transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                aria-label="Profile menu"
              >
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-semibold text-foreground">
                  {displayName?.trim() || email.split("@")[0] || "Account"}
                </p>
                <p className="text-xs text-muted-foreground font-normal truncate">{email || "—"}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                onSelect={() => handleLogout()}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Layer 2: Page title — below top bar, separated from chrome controls */}
      <div className="w-full border-b border-border/40 pt-8 pb-6">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="min-w-0"
        >
          <h1 className={cn(meta.titleClassName)}>{meta.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{meta.subtitle}</p>
        </motion.div>
      </div>
    </header>
  );
}
