"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Satellite,
  Database,
  ShieldAlert,
  FileWarning,
} from "lucide-react";
import type { RiskFlag } from "@/lib/mock-data";

const iconMap = {
  "alert-triangle": AlertTriangle,
  satellite: Satellite,
  database: Database,
  "shield-alert": ShieldAlert,
  "file-warning": FileWarning,
};

const severityColors = {
  high: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: "text-red-400",
    dot: "bg-red-400",
  },
  medium: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    icon: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  low: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    dot: "bg-emerald-400",
  },
};

interface AIAnalysisProps {
  flags: RiskFlag[];
}

export function AIAnalysis({ flags }: AIAnalysisProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <ShieldAlert className="h-5 w-5 text-emerald-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          AI Risk Analysis
        </h3>
      </div>

      <div className="space-y-3">
        {flags.map((flag, i) => {
          const Icon = iconMap[flag.icon];
          const colors = severityColors[flag.severity];

          return (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className={`flex items-start gap-3 p-3.5 rounded-xl ${colors.bg} border ${colors.border}`}
            >
              <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/90 leading-relaxed">
                  {flag.label}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.icon}`}
              >
                {flag.severity}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
