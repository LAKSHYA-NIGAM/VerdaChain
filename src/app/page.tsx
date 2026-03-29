"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Satellite,
  Link2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ─── Star Canvas (Constellation Animation) ───────────────────────────────────

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -9999, y: -9999 };

    const STAR_COUNT = 120;
    const CONNECTION_DISTANCE = 150;
    const MOUSE_DISTANCE = 200;

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update star positions
      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      }

      // Draw star-to-star connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw cursor connections — brighter and thicker
      for (const star of stars) {
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_DISTANCE) {
          const alpha = (1 - dist / MOUSE_DISTANCE) * 0.8;
          const lineW = (1 - dist / MOUSE_DISTANCE) * 1.2;

          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(star.x, star.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.lineWidth = lineW;
          ctx.stroke();

          // Make nearby stars brighter
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.fill();
        }
      }

      // Draw all stars
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();
      }

      // Draw cursor dot
      if (mouse.x !== -9999) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Modal Charts ─────────────────────────────────────────────────────────────

function RiskDistributionChart() {
  const bars = [
    { label: "Low Risk", pct: 38, color: "#34d399" },
    { label: "Medium Risk", pct: 43, color: "#fbbf24" },
    { label: "High Risk", pct: 19, color: "#f87171" },
  ];
  return (
    <div className="space-y-3">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-white/50">{b.label}</span>
            <span className="text-xs font-semibold" style={{ color: b.color }}>{b.pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChainViz() {
  const steps = [
    { label: "SHA-256", sub: "Result hash" },
    { label: "bytes32", sub: "Encoded" },
    { label: "Sepolia", sub: "On-chain" },
    { label: "Proof ✓", sub: "Etherscan" },
  ];
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          <div className="text-center px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 min-w-[72px]">
            <p className="text-sm font-bold text-emerald-400 font-mono">{s.label}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{s.sub}</p>
          </div>
          {i < steps.length - 1 && <span className="text-emerald-500/40 text-base">→</span>}
        </div>
      ))}
    </div>
  );
}

function SatelliteChart() {
  const data = [
    { zone: "Zone A", ndvi: 82, defor: 4 },
    { zone: "Zone B", ndvi: 61, defor: 18 },
    { zone: "Zone C", ndvi: 45, defor: 28 },
    { zone: "Zone D", ndvi: 74, defor: 9 },
  ];
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.zone}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-white/50">{d.zone}</span>
            <span className="text-[10px] text-white/30">NDVI {d.ndvi}% · Defor {d.defor}%</span>
          </div>
          <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500/60 rounded-l" style={{ width: `${d.ndvi}%` }} />
            <div className="h-full bg-red-400/60 rounded-r" style={{ width: `${d.defor * 2}%` }} />
          </div>
        </div>
      ))}
      <div className="flex gap-4 pt-1">
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded bg-emerald-500/60" /><span className="text-[10px] text-white/30">NDVI Health</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded bg-red-400/60" /><span className="text-[10px] text-white/30">Deforestation</span></div>
      </div>
    </div>
  );
}

// ─── Modal content definitions ────────────────────────────────────────────────

type CardId = "ai" | "chain" | "sat";

const MODAL_CONTENT: Record<CardId, {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  stats: { val: string; lbl: string }[];
  chartTitle: string;
  chartNote: string;
  Chart: React.FC;
  bullets: { color: string; text: string }[];
}> = {
  ai: {
    icon: Sparkles,
    title: "AI Verified",
    subtitle: "Multi-Layer Machine Learning Risk Engine",
    description:
      "VerdaChain's ML model cross-checks 15+ independent risk vectors for every carbon credit submitted. Each credit is scored 0–100 factoring registry conflicts, issuer history, MRV methodology audits, satellite deforestation data, and financial additionality analysis.",
    stats: [
      { val: "15+", lbl: "Risk Vectors" },
      { val: "<2s", lbl: "Analysis Time" },
      { val: "94%", lbl: "Fraud Detection" },
      { val: "3", lbl: "Registries Checked" },
    ],
    chartTitle: "Risk Score Distribution",
    chartNote: "Based on 4,200+ verifications processed through the VerdaChain engine",
    Chart: RiskDistributionChart,
    bullets: [
      { color: "bg-emerald-400", text: "Registry cross-validation against Verra, Gold Standard, and ACR" },
      { color: "bg-yellow-400", text: "Satellite NDVI deforestation overlay per project boundary" },
      { color: "bg-blue-400", text: "Issuer historical flag scoring and methodology audit" },
      { color: "bg-purple-400", text: "Credit issuance vs. baseline comparison (over-crediting detection)" },
    ],
  },
  chain: {
    icon: Link2,
    title: "On-chain Proof",
    subtitle: "Immutable Ethereum Blockchain Records",
    description:
      "Every verification result is SHA-256 fingerprinted and permanently written to the Ethereum Sepolia blockchain via the VerdaChain smart contract. Once stored, the record cannot be altered — providing tamper-proof, publicly auditable evidence for every credit verification.",
    stats: [
      { val: "SHA-256", lbl: "Hash Algorithm" },
      { val: "Sepolia", lbl: "Network" },
      { val: "bytes32", lbl: "Chain Format" },
      { val: "∞", lbl: "Permanence" },
    ],
    chartTitle: "Verification Pipeline",
    chartNote: "Each step is cryptographically linked — altering any step invalidates the entire chain",
    Chart: ChainViz,
    bullets: [
      { color: "bg-emerald-400", text: "SHA-256 fingerprint of the full risk analysis result" },
      { color: "bg-blue-400", text: "Written to Sepolia via logVerification() smart contract call" },
      { color: "bg-purple-400", text: "Transaction hash verifiable on Etherscan in real-time" },
      { color: "bg-orange-400", text: "MetaMask wallet signs each transaction — no central authority" },
    ],
  },
  sat: {
    icon: Satellite,
    title: "Satellite Data Checked",
    subtitle: "Real-Time NDVI Deforestation Monitoring",
    description:
      "VerdaChain cross-references project boundaries with NDVI (Normalized Difference Vegetation Index) satellite imagery. Each zone is analyzed for vegetation health over a 5-year baseline, flagging projects where deforestation contradicts claimed carbon sequestration volumes.",
    stats: [
      { val: "30m", lbl: "Resolution" },
      { val: "5yr", lbl: "Baseline" },
      { val: "NDVI", lbl: "Index Used" },
      { val: "16d", lbl: "Revisit Cycle" },
    ],
    chartTitle: "NDVI vs. Deforestation by Zone",
    chartNote: "Higher deforestation vs. NDVI indicates potential greenwashing in the project area",
    Chart: SatelliteChart,
    bullets: [
      { color: "bg-emerald-400", text: "NDVI values below 0.4 flag potential vegetation loss" },
      { color: "bg-yellow-400", text: "Deforestation >20% in project zone triggers HIGH RISK" },
      { color: "bg-blue-400", text: "Temporal comparison validates claimed sequestration volumes" },
      { color: "bg-red-400", text: "Cross-registry boundary overlaps catch duplicate-credit fraud" },
    ],
  },
};

// ─── Landing Page ─────────────────────────────────────────────────────────────

const CARDS: { id: CardId; icon: React.ElementType; label: string; desc: string }[] = [
  { id: "ai", icon: Sparkles, label: "AI Verified", desc: "Machine learning risk analysis" },
  { id: "chain", icon: Link2, label: "On-chain Proof", desc: "Immutable blockchain records" },
  { id: "sat", icon: Satellite, label: "Satellite Checked", desc: "Real-time deforestation monitoring" },
];

export default function LandingPage() {
  const [openCard, setOpenCard] = useState<CardId | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCard(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Animated gradient backdrop */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-emerald-950/10 animated-gradient" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050805] to-transparent" />
      </div>

      <ParticleBackground />

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center px-6 lg:px-12 py-5"
      >
        <div className="flex items-center">
          <svg width="220" height="50" viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(80, 100)">
              <polygon points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26" fill="none" stroke="#10b981" strokeWidth="2.5"/>
              <polygon points="0,-38 33,-19 33,19 0,38 -33,19 -33,-19" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
              <rect x="-28" y="-7" width="16" height="14" rx="7" fill="none" stroke="#10b981" strokeWidth="2.2"/>
              <rect x="12" y="-7" width="16" height="14" rx="7" fill="none" stroke="#10b981" strokeWidth="2.2"/>
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#10b981" strokeWidth="2.2"/>
              <polyline points="-10,-22 0,-10 10,-22" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <text x="145" y="112" fontFamily="system-ui, sans-serif" fontSize="48" fontWeight="700" letterSpacing="2" fill="#10b981">VERDA</text>
            <text x="310" y="112" fontFamily="system-ui, sans-serif" fontSize="48" fontWeight="300" letterSpacing="2" fill="white">CHAIN</text>
          </svg>
        </div>
      </motion.nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -mt-12">
        {/* Headline */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl"
        >
          <span className="text-white">The Carbon Credit</span>
          <br />
          <span className="gradient-text text-glow">Lie Detector</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-6 text-base sm:text-lg text-white/50 max-w-xl leading-relaxed"
        >
          Verify carbon credits instantly using AI + blockchain-backed
          transparency. Detect fraud before it hits the market.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10"
        >
          <Link href="/dashboard/verify">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="h-12 px-8 text-base font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition-all duration-300 glow-emerald-strong cursor-pointer group">
                Start Verification
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Trust Badge Cards — compact, click opens modal */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full"
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={() => setOpenCard(card.id)}
              className="glass rounded-2xl p-5 text-center group cursor-pointer"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <card.icon className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">{card.label}</p>
              <p className="text-xs text-white/40">{card.desc}</p>
              <p className="text-[10px] text-emerald-400/50 mt-2 font-medium group-hover:text-emerald-400/80 transition-colors">
                Click to learn more →
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-xs text-white/20">© 2026 VerdaChain. All rights reserved.</p>
      </div>

      {/* ── Full-Screen Modal ── */}
      <AnimatePresence>
        {openCard && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/75 backdrop-blur-sm"
            onClick={() => setOpenCard(null)}
          >
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.9, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 32 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-3xl border border-white/[0.08] shadow-2xl"
              style={{ background: "rgba(10,14,10,0.97)" }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent" />

              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    {(() => { const Icon = MODAL_CONTENT[openCard].icon; return <Icon className="h-6 w-6 text-emerald-400" />; })()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{MODAL_CONTENT[openCard].title}</h2>
                    <p className="text-xs text-emerald-400/70 mt-0.5">{MODAL_CONTENT[openCard].subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpenCard(null)}
                  className="flex-shrink-0 mt-0.5 p-2 rounded-xl hover:bg-white/[0.06] text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Description */}
                <p className="text-sm text-white/55 leading-relaxed">{MODAL_CONTENT[openCard].description}</p>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2">
                  {MODAL_CONTENT[openCard].stats.map((s) => (
                    <div key={s.lbl} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-emerald-400 font-mono">{s.val}</p>
                      <p className="text-[9px] text-white/30 mt-0.5 leading-tight">{s.lbl}</p>
                    </div>
                  ))}
                </div>

                {/* Bullets */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-3">How It Works</p>
                  <div className="space-y-2.5">
                    {MODAL_CONTENT[openCard].bullets.map((b) => (
                      <div key={b.text} className="flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${b.color}`} />
                        <p className="text-sm text-white/50 leading-relaxed">{b.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-0.5">
                    {MODAL_CONTENT[openCard].chartTitle}
                  </p>
                  <p className="text-[10px] text-white/20 mb-4">{MODAL_CONTENT[openCard].chartNote}</p>
                  {(() => { const Chart = MODAL_CONTENT[openCard].Chart; return <Chart />; })()}
                </div>

                {/* Close hint */}
                <p className="text-center text-[10px] text-white/15">Press ESC or click outside to close</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
