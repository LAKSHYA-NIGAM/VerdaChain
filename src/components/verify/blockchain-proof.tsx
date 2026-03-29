"use client";

import { motion } from "framer-motion";
import { ExternalLink, Clock, Blocks, Globe, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlockchainProof as BlockchainProofType } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { connectWallet, storeVerificationOnChain, getEtherscanUrl, CONTRACT_ADDRESS } from "@/lib/blockchain";

interface BackendResult {
  creditId: string;
  riskScore: number;
  status: string;
  resultHash: string;
  [key: string]: unknown;
}

interface BlockchainProofProps {
  proof: BlockchainProofType;
  verificationData?: BackendResult | null;
}

type ChainState = "idle" | "connecting" | "sending" | "confirmed" | "error";

export function BlockchainProofPanel({ proof, verificationData }: BlockchainProofProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [chainState, setChainState] = useState<ChainState>("idle");
  const [realTxHash, setRealTxHash] = useState<string | null>(null);

  useEffect(() => {
    setFormattedDate(
      new Date(proof.timestamp).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    );
  }, [proof.timestamp]);

  const handleCopyHash = async () => {
    const hashToCopy = realTxHash || proof.txHash;
    try {
      await navigator.clipboard.writeText(hashToCopy);
      setCopied(true);
      toast.success("Transaction hash copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleStoreOnChain = async () => {
    if (!verificationData) {
      toast.error("No verification data to store");
      return;
    }

    try {
      // Step 1: Connect wallet
      setChainState("connecting");
      toast.loading("Connecting to MetaMask...", { id: "chain" });
      const account = await connectWallet();

      // Guard: warn clearly if contract hasn't been deployed yet
      if (CONTRACT_ADDRESS.startsWith("0x_REPLACE")) {
        throw new Error("Smart contract not deployed yet. Follow contracts/DEPLOY_INSTRUCTIONS.md to deploy on Sepolia, then update CONTRACT_ADDRESS in src/lib/blockchain.ts");
      }

      // Step 2: Send transaction
      setChainState("sending");
      toast.loading("Writing to Ethereum...", { id: "chain" });
      const txHash = await storeVerificationOnChain(
        verificationData.creditId,
        verificationData.resultHash,
        verificationData.riskScore,
        verificationData.status
      );

      // Step 3: Confirmed
      setRealTxHash(txHash);
      setChainState("confirmed");
      toast.success("Audit stored on blockchain!", { id: "chain" });
    } catch (err) {
      setChainState("error");
      const message = err instanceof Error ? err.message : "Transaction failed";
      toast.error(message, { id: "chain" });
    }
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
        {/* SHA-256 Result Hash */}
        <div>
          <p className="text-xs text-white/40 mb-1">Result Hash (SHA-256)</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-emerald-400 font-mono bg-emerald-500/5 px-3 py-1.5 rounded-lg break-all">
              {realTxHash || proof.txHash}
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

        {/* Network */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-white/30" />
          <div>
            <p className="text-xs text-white/40">Network</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-sm text-emerald-400 font-medium">Sepolia Testnet</p>
            </div>
          </div>
        </div>

        {/* Confirmed State */}
        {chainState === "confirmed" && realTxHash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 pt-2"
          >
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">✅ Audit stored on Ethereum blockchain</span>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Transaction Hash</p>
              <code className="text-xs text-emerald-400/80 font-mono break-all">
                {realTxHash}
              </code>
            </div>
            <a
              href={getEtherscanUrl(realTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              🔗 View on Etherscan
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <p className="text-xs text-white/20">
              This record is now permanent and tamper-proof.
            </p>
          </motion.div>
        )}
      </div>

      {/* Blockchain Action Button */}
      {chainState !== "confirmed" && (
        <motion.div className="mt-5" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={chainState === "error" ? () => setChainState("idle") : handleStoreOnChain}
            disabled={chainState === "connecting" || chainState === "sending"}
            variant="outline"
            className={`w-full h-10 rounded-xl transition-all gap-2 cursor-pointer ${
              chainState === "error"
                ? "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10"
                : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30"
            }`}
          >
            {chainState === "idle" && (
              <>
                <Blocks className="h-4 w-4" />
                ⛓️ Store Audit on Blockchain
              </>
            )}
            {chainState === "connecting" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                🔌 Connecting MetaMask...
              </>
            )}
            {chainState === "sending" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                📤 Writing to Ethereum...
              </>
            )}
            {chainState === "error" && "❌ Failed — Try Again"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
