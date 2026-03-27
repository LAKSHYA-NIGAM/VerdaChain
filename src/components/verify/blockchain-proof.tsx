"use client";

import { motion } from "framer-motion";
import { ExternalLink, Clock, Blocks, Globe, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlockchainProof as BlockchainProofType } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface BlockchainProofProps {
  proof: BlockchainProofType;
}

export function BlockchainProofPanel({ proof }: BlockchainProofProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedBlock, setFormattedBlock] = useState<string>(
    String(proof.blockNumber)
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFormattedDate(
      new Date(proof.timestamp).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    );
    setFormattedBlock(proof.blockNumber.toLocaleString());
  }, [proof.timestamp, proof.blockNumber]);

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(proof.txHash);
      setCopied(true);
      toast.success("Transaction hash copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleViewOnChain = () => {
    // Open Etherscan with the simulated tx hash
    const etherscanUrl = `https://etherscan.io/tx/${proof.txHash}`;
    window.open(etherscanUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Blocks className="h-5 w-5 text-emerald-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Blockchain Proof
        </h3>
      </div>

      <div className="space-y-4">
        {/* Tx Hash */}
        <div>
          <p className="text-xs text-white/40 mb-1">Transaction Hash</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-emerald-400 font-mono bg-emerald-500/5 px-3 py-1.5 rounded-lg break-all">
              {proof.txHash}
            </code>
            <button
              onClick={handleCopyHash}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
              title="Copy hash"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4 text-white/30 hover:text-white/60" />
              )}
            </button>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-white/30" />
          <div>
            <p className="text-xs text-white/40">Timestamp</p>
            <p className="text-sm text-white/80" suppressHydrationWarning>
              {formattedDate || "Loading..."}
            </p>
          </div>
        </div>

        {/* Block Number */}
        <div className="flex items-center gap-2">
          <Blocks className="h-4 w-4 text-white/30" />
          <div>
            <p className="text-xs text-white/40">Block Number</p>
            <p className="text-sm text-white/80 font-mono" suppressHydrationWarning>
              {formattedBlock}
            </p>
          </div>
        </div>

        {/* Network */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-white/30" />
          <div>
            <p className="text-xs text-white/40">Network</p>
            <p className="text-sm text-white/80">{proof.network}</p>
          </div>
        </div>
      </div>

      {/* View on Chain Button */}
      <motion.div className="mt-5" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleViewOnChain}
          variant="outline"
          className="w-full h-10 rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all gap-2 cursor-pointer"
        >
          <ExternalLink className="h-4 w-4" />
          View on Chain
        </Button>
      </motion.div>
    </motion.div>
  );
}
