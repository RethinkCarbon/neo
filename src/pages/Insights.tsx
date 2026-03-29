import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  ArrowRight,
  CheckCircle2,
  Pause,
  Target,
  DollarSign,
  BarChart3,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const alerts = [
  {
    severity: "critical" as const,
    title: 'CPA Spike on "Summer Sale"',
    description: 'CPA on campaign "Summer Sale" is 20% higher than the 30-day average ($8.86 vs $7.38). This is eroding ROAS rapidly.',
    metric: "+20%",
    metricLabel: "above avg CPA",
    campaign: "Summer Sale 2024",
    icon: TrendingUp,
  },
  {
    severity: "warning" as const,
    title: "Budget Overspend — Lookalike Scale",
    description: "The Lookalike Scale campaign has consumed 89% of its daily budget by 2pm. At this pace, it will overspend by ~$120 today.",
    metric: "89%",
    metricLabel: "budget used by 2pm",
    campaign: "Lookalike Scale",
    icon: DollarSign,
  },
  {
    severity: "warning" as const,
    title: "Conversion Rate Dropping — X Ads",
    description: "X Ads conversion rate has dropped 34% week-over-week (2.2% → 1.45%). Consider pausing or revising creative.",
    metric: "-34%",
    metricLabel: "conv. rate WoW",
    campaign: "Promoted Tweets Q3",
    icon: TrendingDown,
  },
];

const recommendations = [
  {
    title: "Scale High-ROAS Retargeting",
    description: "Your Meta retargeting campaign achieves 5.1x ROAS — the highest in your account. Increase daily budget by 40% and expand to lookalike audiences for maximum impact.",
    confidence: 94,
    impact: "+$18,200 est. monthly revenue",
    icon: TrendingUp,
  },
  {
    title: "Pause Underperforming X Ads",
    description: "X Ads delivers 2.4x ROAS at the highest CPC ($0.92). Reallocating this budget to TikTok or Meta could improve overall account ROAS by ~12%.",
    confidence: 88,
    impact: "Save ~$9,200/mo",
    icon: Pause,
  },
  {
    title: "Refine Google Ads Targeting",
    description: "Google Ads CPC ($1.20) is 41% above benchmark. Adding negative keywords and tightening geo-targeting could reduce CPC by an estimated 18% without losing volume.",
    confidence: 82,
    impact: "-18% CPC estimated",
    icon: Target,
  },
  {
    title: "Shift Budget to TikTok",
    description: "TikTok shows the best engagement rate (4.2% CTR) at the lowest CPC ($0.42). A 30% budget increase from underperforming channels could yield significant incremental conversions.",
    confidence: 79,
    impact: "+2,400 est. conversions",
    icon: BarChart3,
  },
];

const insightList = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

const insightItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 90 ? "bg-primary" : value >= 80 ? "bg-success" : "bg-warning";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">{value}%</span>
    </div>
  );
}

const Insights = () => {
  return (
    <DashboardLayout>
      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none">
          <Brain className="w-full h-full" />
        </div>
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-base font-semibold text-foreground">Account health summary</h2>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">Live</span>
            </div>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              Overall account performance <span className="metric-positive font-medium">improved 8.2% this week</span>.
              Google Ads conversions increased <span className="metric-positive font-medium">18%</span> with stable CPA.
              Meta campaigns show a <span className="metric-negative font-medium">rising CPA (+12%)</span> that needs attention.
              TikTok remains your most cost-efficient channel at <span className="text-foreground font-medium">$0.42 CPC</span>.
              Recommend shifting 15% of X Ads budget to TikTok and pausing the underperforming "Promoted Tweets Q3" campaign.
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Analyzed 10 campaigns</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> 5 platforms scanned</span>
              <span>Updated 2 min ago</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-500" />
          Insight cards
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400">{alerts.length}</span>
        </motion.h2>

        <motion.div
          variants={insightList}
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              variants={insightItem}
              className="relative overflow-hidden rounded-xl border transition-all duration-300 group cursor-pointer hover:-translate-y-0.5"
              style={{
                background: alert.severity === "critical"
                  ? "linear-gradient(135deg, hsl(0 84% 60% / 0.08), hsl(0 84% 60% / 0.02))"
                  : "linear-gradient(135deg, hsl(38 92% 50% / 0.08), hsl(38 92% 50% / 0.02))",
                borderColor: alert.severity === "critical"
                  ? "hsl(0 84% 60% / 0.2)"
                  : "hsl(38 92% 50% / 0.2)",
              }}
            >
              {/* Top glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: alert.severity === "critical"
                    ? "linear-gradient(90deg, transparent, hsl(0 84% 60% / 0.5), transparent)"
                    : "linear-gradient(90deg, transparent, hsl(38 92% 50% / 0.5), transparent)",
                }}
              />

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    alert.severity === "critical" ? "bg-danger/15" : "bg-warning/15"
                  }`}>
                    <alert.icon className={`w-4 h-4 ${
                      alert.severity === "critical" ? "text-danger" : "text-warning"
                    }`} />
                  </div>
                  <div className={`text-right`}>
                    <p className={`text-lg font-bold ${
                      alert.severity === "critical" ? "text-danger" : "text-warning"
                    }`}>{alert.metric}</p>
                    <p className="text-[10px] text-muted-foreground">{alert.metricLabel}</p>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-foreground mb-1.5">{alert.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{alert.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{alert.campaign}</span>
                  <button className={`text-xs font-medium flex items-center gap-1 transition-colors ${
                    alert.severity === "critical"
                      ? "text-danger hover:text-danger/80"
                      : "text-warning hover:text-warning/80"
                  }`}>
                    Fix Now <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recommendations */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-primary" />
          Recommendations
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{recommendations.length}</span>
        </motion.h2>

        <motion.div
          variants={insightList}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {recommendations.map((rec, i) => (
            <motion.div
              key={i}
              variants={insightItem}
              className="glass-card-hover p-5 group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <rec.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{rec.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                </div>
              </div>

              {/* Confidence */}
              <div className="mb-4">
                <p className="text-[10px] text-muted-foreground mb-1">Confidence score</p>
                <ConfidenceBar value={rec.confidence} />
              </div>

              <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider">Expected improvement</p>
              <p className="text-xs font-semibold text-emerald-400 mb-4">{rec.impact}</p>

              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border/50">
                <Button
                  size="sm"
                  className="flex-1 rounded-lg text-xs font-semibold gap-1.5 h-9 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  onClick={() =>
                    toast.success("Recommendation applied", {
                      description: `${rec.title} — changes are queued for your ad accounts.`,
                    })
                  }
                >
                  Apply recommendation
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-lg text-xs font-semibold gap-1.5 h-9 border-border/80 bg-accent/20 hover:bg-accent/40 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  onClick={() =>
                    toast.message("Saved for later", {
                      description: rec.title,
                    })
                  }
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Save for later
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Insights;
