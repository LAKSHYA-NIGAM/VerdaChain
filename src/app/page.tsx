"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Satellite,
  Link2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

// ─── Particle Background ──────────────────────────────────────────────────────

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}

// ─── Trust Badges ─────────────────────────────────────────────────────────────

const trustBadges = [
  {
    icon: Sparkles,
    label: "AI Verified",
    desc: "Machine learning risk analysis",
  },
  {
    icon: Link2,
    label: "On-chain Proof",
    desc: "Immutable blockchain records",
  },
  {
    icon: Satellite,
    label: "Satellite Data Checked",
    desc: "Real-time deforestation monitoring",
  },
];

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#050805]">
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
        className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Verda<span className="text-emerald-400">Chain</span>
          </span>
        </div>
        <Link href="/dashboard/verify">
          <Button
            variant="outline"
            className="h-9 rounded-xl border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white text-sm"
          >
            Launch App
          </Button>
        </Link>
      </motion.nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center -mt-12">
        {/* Pill badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Powered by AI + Blockchain
          </div>
        </motion.div>

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
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button className="h-12 px-8 text-base font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition-all duration-300 glow-emerald-strong cursor-pointer group">
                Start Verification
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full"
        >
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="glass rounded-2xl p-5 text-center group cursor-default"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <badge.icon className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                {badge.label}
              </p>
              <p className="text-xs text-white/40">{badge.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-xs text-white/20">
          © 2024 VerdaChain. All rights reserved.
        </p>
      </div>
    </div>
  );
}
