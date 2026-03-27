"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RiskScoreProps {
  score: number;
  status: string;
}

export function RiskScore({ score, status }: RiskScoreProps) {
  const [currentScore, setCurrentScore] = useState(0);

  // Determine color based on score
  const getColor = (s: number) => {
    if (s <= 30) return { stroke: "#10b981", bg: "rgba(16,185,129,0.1)", text: "text-emerald-400", label: "Low Risk" };
    if (s <= 60) return { stroke: "#fbbf24", bg: "rgba(251,191,36,0.1)", text: "text-yellow-400", label: "Medium Risk" };
    return { stroke: "#ef4444", bg: "rgba(239,68,68,0.1)", text: "text-red-400", label: "High Risk" };
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 88;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  useEffect(() => {
    setCurrentScore(0);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentScore((prev) => {
          if (prev >= score) {
            clearInterval(interval);
            return score;
          }
          return prev + 1;
        });
      }, 15);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-52 h-52">
        {/* Glow effect */}
        <div
          className="absolute inset-4 rounded-full blur-xl opacity-30"
          style={{ background: color.bg }}
        />

        {/* SVG Ring */}
        <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 200 200">
          {/* Track */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Progress */}
          <motion.circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke={color.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 8px ${color.stroke}40)`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${color.text} tabular-nums`}>
            {currentScore}
          </span>
          <span className="text-xs text-white/40 mt-1 uppercase tracking-widest">
            Risk Score
          </span>
        </div>
      </div>

      {/* Status badge */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4"
      >
        <div
          className="px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{
            background: color.bg,
            color: color.stroke,
            border: `1px solid ${color.stroke}30`,
          }}
        >
          {status}
        </div>
      </motion.div>
    </motion.div>
  );
}
