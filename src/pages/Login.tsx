import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Lock,
  Mail,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BarChart3,
    title: "Unified cross-channel metrics",
    body: "Google, Meta, TikTok, Snapchat, and X in one glass dashboard.",
  },
  {
    icon: Zap,
    title: "Real-time performance",
    body: "Track ROAS, spend, and conversions as campaigns evolve.",
  },
  {
    icon: Sparkles,
    title: "Insight-ready data",
    body: "Surface trends and anomalies before they cost you budget.",
  },
] as const;

export default function Login() {
  const { isAuthenticated, loading, login, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error: err } = await signUp(trimmed, password);
        if (err) {
          setError(err.message);
          return;
        }
        setInfo(
          "Check your email to confirm your account, then sign in. If confirmations are disabled in Supabase, you can sign in now.",
        );
        setMode("signin");
        return;
      }

      const { error: err } = await login(trimmed, password, remember);
      if (err) {
        setError(err.message);
        return;
      }
      navigate(from, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Ambient layer */}
      <div className="login-ambient pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden />

      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row">
        {/* Brand panel */}
        <motion.div
          className="relative flex flex-1 flex-col justify-between overflow-hidden border-b border-border/40 px-8 py-10 sm:px-12 lg:min-h-screen lg:border-b-0 lg:border-r lg:py-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-brand-bg absolute inset-0 -z-10" aria-hidden />
          <div className="relative flex flex-col gap-10">
            <Link to="/login" className="inline-flex items-center gap-3 w-fit group">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/25 shadow-lg shadow-primary/10">
                <Activity className="h-5 w-5 text-primary" strokeWidth={2.2} />
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-60" />
              </div>
              <div>
                <span className="block text-lg font-bold tracking-tight leading-none">{SITE_NAME}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {SITE_TAGLINE}
                </span>
              </div>
            </Link>

            <div className="max-w-md space-y-4">
              <motion.h1
                className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45 }}
              >
                <span className="gradient-text">Clarity</span>
                <span className="text-foreground"> for every ad dollar.</span>
              </motion.h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{SITE_DESCRIPTION}</p>
            </div>

            <ul className="hidden sm:flex flex-col gap-5 max-w-lg">
              {features.map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                  className="flex gap-4 rounded-2xl border border-white/5 bg-black/20 px-4 py-3 backdrop-blur-sm dark:bg-white/[0.03]"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
                    <item.icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="relative mt-10 text-[11px] text-muted-foreground/80 sm:mt-0">
            © {new Date().getFullYear()} {SITE_NAME}. Crafted for modern growth teams.
          </p>
        </motion.div>

        {/* Form column */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-12 sm:px-10">
          <div className="absolute right-5 top-5 sm:right-8 sm:top-8 flex items-center gap-2">
            <ThemeToggle />
          </div>

          <motion.div
            className="w-full max-w-[400px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {mode === "signin"
                  ? "Sign in with the email and password you use in Supabase Auth."
                  : "Sign up with your work email. You may need to confirm your email depending on project settings."}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/20">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      aria-hidden
                    />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn("h-11 pl-10 bg-background/50 border-border/80")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="password" className="text-xs font-medium">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-[11px] font-medium text-primary hover:underline"
                      onClick={() => {
                        /* placeholder — no backend */
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      aria-hidden
                    />
                    <Input
                      id="password"
                      type="password"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={cn("h-11 pl-10 bg-background/50 border-border/80")}
                    />
                  </div>
                </div>

                {mode === "signin" && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={remember}
                      onCheckedChange={(v) => setRemember(v === true)}
                    />
                    <Label htmlFor="remember" className="text-xs font-normal cursor-pointer leading-none">
                      Keep me signed in on this device
                    </Label>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-destructive font-medium" role="alert">
                    {error}
                  </p>
                )}

                {info && (
                  <p className="text-xs text-muted-foreground leading-relaxed" role="status">
                    {info}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20"
                  disabled={submitting}
                >
                  {submitting ? (
                    mode === "signup" ? "Creating account…" : "Signing in…"
                  ) : mode === "signup" ? (
                    "Create account"
                  ) : (
                    <>
                      Enter dashboard
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  {mode === "signin" ? (
                    <>
                      No account?{" "}
                      <button
                        type="button"
                        className="font-medium text-primary hover:underline"
                        onClick={() => {
                          setMode("signup");
                          setError(null);
                          setInfo(null);
                        }}
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="font-medium text-primary hover:underline"
                        onClick={() => {
                          setMode("signin");
                          setError(null);
                          setInfo(null);
                        }}
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </form>
            </div>

            <p className="mt-6 text-center text-[11px] text-muted-foreground">
              By continuing you agree to our terms of service and privacy policy.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
