import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";
import { useId } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { AnimatedCounter } from "./AnimatedCounter";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  sparkData: number[];
  comparison?: string;
  delay?: number;
  /** When true, a negative change is "good" (e.g. CPA down) and shown in emerald. */
  invertTrend?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  sparkData,
  comparison = "vs last 30 days",
  delay = 0,
  invertTrend = false,
}: MetricCardProps) {
  const gradId = useId().replace(/:/g, "");
  const rawPositive = change >= 0;
  const positive = invertTrend ? !rawPositive : rawPositive;
  const chartData = sparkData.map((v, i) => ({ v, i }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="glass-card-hover p-5 relative overflow-hidden group"
    >
      {/* Ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full blur-2xl"
        style={{ background: positive ? "hsl(160 84% 39% / 0.08)" : "hsl(0 84% 60% / 0.08)" }}
      />

      {/* Icon + trend row */}
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-primary/8 border border-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div
          className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-1 rounded-lg ${
            positive ? "bg-emerald-500/10 metric-positive" : "bg-red-500/10 metric-negative"
          }`}
        >
          {rawPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>

      {/* Label */}
      <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase mb-1">{title}</p>

      {/* Value */}
      <AnimatedCounter value={value} className="text-[22px] font-extrabold text-foreground tracking-tight leading-none mb-3 block" />

      {/* Sparkline */}
      <div className="h-10 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id={`spark-${gradId}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={positive ? "#10b981" : "#ef4444"} stopOpacity={0.35} />
                <stop offset="100%" stopColor={positive ? "#10b981" : "#ef4444"} stopOpacity={1} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="v"
              stroke={`url(#spark-${gradId})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison */}
      <p className="text-[10px] text-muted-foreground/70">{comparison}</p>
    </motion.div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="skeleton h-[180px]" />
  );
}
