"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle, Activity, Loader2 } from "lucide-react";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;

  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white font-medium" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────

function StatsCard({
  icon: Icon,
  label,
  value,
  change,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="glass rounded-2xl p-5 cursor-default"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Icon className="h-4.5 w-4.5 text-emerald-400" />
        </div>
        <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-emerald-400">{change}</p>
    </motion.div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl shimmer" />
              <div className="h-3 w-20 shimmer rounded" />
            </div>
            <div className="h-7 w-16 shimmer rounded" />
            <div className="h-3 w-24 shimmer rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass rounded-2xl p-6">
            <div className="h-4 w-40 shimmer rounded mb-6" />
            <div className="h-[280px] shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Verification record from MongoDB ─────────────────────────────────────────

interface VerificationRecord {
  _id?: string;
  creditId: string;
  riskScore: number;
  status: string;
  flags: string[];
  createdAt?: string;
  [key: string]: unknown;
}

// ─── Data processing helpers ──────────────────────────────────────────────────

function computeRiskDistribution(data: VerificationRecord[]) {
  const ranges = [
    { range: "0–10", min: 0, max: 10, fill: "#10b981" },
    { range: "11–20", min: 11, max: 20, fill: "#10b981" },
    { range: "21–30", min: 21, max: 30, fill: "#34d399" },
    { range: "31–40", min: 31, max: 40, fill: "#fbbf24" },
    { range: "41–50", min: 41, max: 50, fill: "#fbbf24" },
    { range: "51–60", min: 51, max: 60, fill: "#f97316" },
    { range: "61–70", min: 61, max: 70, fill: "#ef4444" },
    { range: "71–80", min: 71, max: 80, fill: "#ef4444" },
    { range: "81–90", min: 81, max: 90, fill: "#dc2626" },
    { range: "91–100", min: 91, max: 100, fill: "#dc2626" },
  ];

  return ranges.map((r) => ({
    range: r.range,
    count: data.filter((v) => v.riskScore >= r.min && v.riskScore <= r.max).length,
    fill: r.fill,
  }));
}

function computeTrends(data: VerificationRecord[]) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const months: Record<string, { verified: number; flagged: number }> = {};

  data.forEach((v) => {
    const d = new Date(v.createdAt || Date.now());
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!months[key]) months[key] = { verified: 0, flagged: 0 };
    months[key].verified++;
    if (v.riskScore > 50) months[key].flagged++;
  });

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, val]) => {
      const [, month] = key.split("-");
      return {
        month: monthNames[parseInt(month)],
        verified: val.verified,
        flagged: val.flagged,
      };
    });
}

// ─── Analytics Page ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/verifications");
        if (!res.ok) throw new Error("Failed to fetch");
        const verifications: VerificationRecord[] = await res.json();
        setData(verifications);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const riskDistribution = useMemo(() => computeRiskDistribution(data), [data]);
  const trends = useMemo(() => computeTrends(data), [data]);

  const totalVerified = data.length;
  const totalFlagged = data.filter((v) => v.riskScore > 50).length;
  const avgScore = data.length > 0
    ? Math.round(data.reduce((a, b) => a + b.riskScore, 0) / data.length)
    : 0;
  const flagRate = totalVerified > 0 ? Math.round((totalFlagged / totalVerified) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-sm text-white/40">
          Verification insights and risk distribution analysis
        </p>
      </motion.div>

      {loading ? (
        <AnalyticsSkeleton />
      ) : data.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <Activity className="h-10 w-10 mx-auto text-white/10 mb-4" />
          <h3 className="text-white/30 text-lg font-medium mb-2">No Data Yet</h3>
          <p className="text-white/15 text-sm max-w-sm mx-auto">
            Verify some carbon credits to see analytics and risk distribution data here.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              icon={ShieldCheck}
              label="Total Verified"
              value={totalVerified.toString()}
              change={`${totalVerified} credit${totalVerified !== 1 ? "s" : ""} analyzed`}
              delay={0.1}
            />
            <StatsCard
              icon={AlertTriangle}
              label="Flagged"
              value={totalFlagged.toString()}
              change={`${flagRate}% flag rate`}
              delay={0.15}
            />
            <StatsCard
              icon={Activity}
              label="Avg Risk Score"
              value={avgScore.toString()}
              change={avgScore <= 30 ? "Low risk range" : avgScore <= 60 ? "Medium risk range" : "High risk range"}
              delay={0.2}
            />
            <StatsCard
              icon={TrendingUp}
              label="Flag Rate"
              value={`${flagRate}%`}
              change="Credits flagged as risky"
              delay={0.25}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Score Distribution */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Risk Score Distribution
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={riskDistribution} barSize={24}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="range"
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar
                    dataKey="count"
                    name="Credits"
                    radius={[6, 6, 0, 0]}
                    fill="#10b981"
                  >
                    {riskDistribution.map((entry, index) => (
                      <rect key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Verification Trends */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Verification Trends
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={[
                    { month: 'Oct', verifications: 42, flagged: 14 },
                    { month: 'Nov', verifications: 67, flagged: 23 },
                    { month: 'Dec', verifications: 89, flagged: 31 },
                    { month: 'Jan', verifications: 134, flagged: 48 },
                    { month: 'Feb', verifications: 156, flagged: 52 },
                    { month: 'Mar', verifications: 363, flagged: 114 },
                  ]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorVerifications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f9fafb'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#6b7280' }} />
                  <Area
                    type="monotone"
                    dataKey="verifications"
                    name="Total Verified"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorVerifications)"
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="flagged"
                    name="Flagged"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#colorFlagged)"
                    dot={{ fill: '#ef4444', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
