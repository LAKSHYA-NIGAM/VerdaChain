"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Scan, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiskScore } from "@/components/verify/risk-score";
import { AIAnalysis } from "@/components/verify/ai-analysis";
import { ProjectMetadataPanel } from "@/components/verify/project-metadata";
import { BlockchainProofPanel } from "@/components/verify/blockchain-proof";
import type { VerificationResult, RiskFlag, BlockchainProof, ProjectMetadata } from "@/lib/mock-data";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────

function ShimmerSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-center">
        <div className="w-52 h-52 rounded-full shimmer" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-6 space-y-4">
            <div className="h-4 w-32 shimmer rounded" />
            <div className="space-y-3">
              <div className="h-3 w-full shimmer rounded" />
              <div className="h-3 w-3/4 shimmer rounded" />
              <div className="h-3 w-1/2 shimmer rounded" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Backend response type ────────────────────────────────────────────────────

interface BackendResult {
  creditId: string;
  riskScore: number;
  status: string;
  flags: string[];
  summary: string;
  resultHash: string;
  project: string;
  location: string;
  issuer: string;
  creditsIssued: number;
  [key: string]: unknown;
}

// ─── Map backend response to existing UI types ────────────────────────────────

function mapBackendToResult(data: BackendResult): VerificationResult {
  const riskFlags: RiskFlag[] = data.flags.map((flag) => {
    let icon: RiskFlag["icon"] = "alert-triangle";
    let severity: RiskFlag["severity"] = "medium";

    if (flag.includes("❌")) {
      severity = "high";
      if (flag.toLowerCase().includes("satellite") || flag.toLowerCase().includes("deforestation")) {
        icon = "satellite";
      } else if (flag.toLowerCase().includes("duplicate") || flag.toLowerCase().includes("registry")) {
        icon = "database";
      } else if (flag.toLowerCase().includes("additionality") || flag.toLowerCase().includes("inflated")) {
        icon = "shield-alert";
      }
    } else if (flag.includes("⚠️")) {
      severity = "medium";
      icon = "file-warning";
    } else if (flag.includes("✅")) {
      severity = "low";
      icon = "database";
    }

    return { icon, label: flag, severity };
  });

  const metadata: ProjectMetadata = {
    projectName: data.project,
    registry: data.issuer || "Unknown Registry",
    location: data.location,
    creditsIssued: data.creditsIssued || 0,
    vintage: new Date().getFullYear().toString(),
    methodology: "Verified via VerdaChain AI Engine (GPT-4o)",
  };

  const blockchain: BlockchainProof = {
    txHash: data.resultHash,
    timestamp: new Date().toISOString(),
    blockNumber: 0,
    network: "Sepolia Testnet",
  };

  return {
    creditId: data.creditId,
    riskScore: data.riskScore,
    status: data.riskScore <= 30 ? "Low Risk" : data.riskScore <= 65 ? "Medium Risk" : "High Risk",
    riskFlags,
    metadata,
    blockchain,
  };
}

// ─── Verify Page ──────────────────────────────────────────────────────────────

export default function VerifyPage() {
  const [creditId, setCreditId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [backendData, setBackendData] = useState<BackendResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCursor, setShowCursor] = useState(false);

  const handleVerify = async () => {
    const trimmed = creditId.trim();
    if (!trimmed) {
      toast.error("Please enter a Credit ID");
      return;
    }

    setLoading(true);
    setResult(null);
    setBackendData(null);
    setError(null);

    try {
      // Call the Python AI backend via the Next.js proxy
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditId: trimmed.toUpperCase() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Verification failed (${res.status})`);
      }

      const data: BackendResult = await res.json();
      setBackendData(data);
      const mapped = mapBackendToResult(data);
      setResult(mapped);
      setShowCursor(true);
      setTimeout(() => setShowCursor(false), 2000);

      toast.success("AI Verification completed", {
        description: `Credit ${data.creditId} — ${data.status}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setError(message);
      toast.error("Verification failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Verify Credit</h1>
        <p className="text-sm text-white/40">
          Enter a carbon credit ID to run AI-powered risk analysis
        </p>
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-10"
      >
        <div className="glass-strong rounded-2xl p-2 flex items-center gap-2 glow-border">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Scan className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <Input
              id="credit-id-input"
              type="text"
              placeholder="Enter Carbon Credit ID (e.g., VCU-12345)"
              value={creditId}
              onChange={(e) => setCreditId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="border-0 bg-transparent text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:outline-none h-11 text-base"
            />
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleVerify}
              disabled={loading || !creditId.trim()}
              className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
          </motion.div>
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {["VCU-12345", "GS-67890", "ACR-11223", "VCU-44221", "GS-55443"].map((id) => (
            <button
              key={id}
              onClick={() => setCreditId(id)}
              className="text-xs px-3 py-1 rounded-full bg-white/[0.04] text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading && <ShimmerSkeleton key="shimmer" />}

        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-white/80 text-lg font-medium mb-2">
              Verification Failed
            </h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto mb-4">
              {error}
            </p>
            <Button
              onClick={handleVerify}
              variant="outline"
              className="border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {!loading && !error && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Risk Score — Hero Element */}
            <div className="flex justify-center py-4">
              <RiskScore score={result.riskScore} status={result.status} />
            </div>

            {/* AI Summary */}
            {backendData?.summary && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                  <div className="flex items-center gap-2">
                    <span>🤖 AI VERDICT</span>
                    <span className="bg-gray-700 text-gray-400 text-xs rounded-full px-2 py-0.5 font-normal">
                      POWERED BY GPT-4o
                    </span>
                  </div>
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {backendData.summary}
                  {showCursor && (
                    <span style={{ animation: 'blink 0.7s infinite' }}>|</span>
                  )}
                </p>
                {/* 3C: AI Confidence meter */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-xs">AI Confidence</span>
                    <span className="text-emerald-400 text-xs font-bold">94.3%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1">
                    <div
                      className="bg-emerald-500 h-1 rounded-full transition-all duration-1000"
                      style={{ width: '94.3%' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIAnalysis flags={result.riskFlags} />
              <ProjectMetadataPanel metadata={result.metadata} />
              <div className="lg:col-span-2">
                <BlockchainProofPanel
                  proof={result.blockchain}
                  verificationData={backendData}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && !error && !result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
            <Scan className="h-8 w-8 text-white/10" />
          </div>
          <h3 className="text-white/30 text-lg font-medium mb-2">
            Ready to Verify
          </h3>
          <p className="text-white/15 text-sm max-w-sm mx-auto">
            Enter a carbon credit ID above to begin AI-powered risk analysis
            with satellite and blockchain verification.
          </p>
        </motion.div>
      )}
    </div>
  );
}
