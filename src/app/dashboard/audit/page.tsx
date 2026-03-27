"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ExternalLink, Calendar, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VerificationRecord } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuditEntry {
  id: string;
  creditId: string;
  riskScore: number;
  status: "High Risk" | "Medium Risk" | "Low Risk";
  timestamp: string;
  txHash: string;
  projectName: string;
  registry: string;
  flags: string[];
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors = {
    "High Risk": "bg-red-500/10 text-red-400 border-red-500/20",
    "Medium Risk": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "Low Risk": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${
        colors[status as keyof typeof colors] || colors["Medium Risk"]
      }`}
    >
      {status}
    </Badge>
  );
}

// ─── Risk Score Bar ───────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score <= 30
      ? "bg-emerald-400"
      : score <= 60
      ? "bg-yellow-400"
      : "bg-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-white/60 font-mono tabular-nums w-6">
        {score}
      </span>
    </div>
  );
}

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="col-span-2 h-3 shimmer rounded" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/[0.03]">
          <div className="col-span-3 h-4 shimmer rounded" />
          <div className="col-span-3 h-4 shimmer rounded" />
          <div className="col-span-2 h-4 shimmer rounded" />
          <div className="col-span-2 h-4 shimmer rounded" />
          <div className="col-span-2 h-4 shimmer rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  log,
  open,
  onClose,
}: {
  log: AuditEntry | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#0f1210] border-white/10 text-white max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <span className="text-emerald-400 font-mono">{log.creditId}</span>
            <StatusBadge status={log.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Risk Score */}
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-xs text-white/40 mb-1">Risk Score</p>
            <p
              className={`text-4xl font-bold tabular-nums ${
                log.riskScore <= 30
                  ? "text-emerald-400"
                  : log.riskScore <= 60
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {log.riskScore}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Project</span>
              <span className="text-white/80 font-medium text-right max-w-[60%]">{log.projectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Registry</span>
              <span className="text-white/80">{log.registry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Tx Hash</span>
              <code className="text-emerald-400/80 text-xs font-mono">
                {log.txHash.slice(0, 10)}...{log.txHash.slice(-4)}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Timestamp</span>
              <span className="text-white/60 text-xs">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Flags */}
          {log.flags.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-wider">Flags</p>
              {log.flags.map((flag, i) => (
                <div key={i} className="glass rounded-lg px-3 py-2 text-xs text-white/60">
                  {flag}
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full h-10 rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Full Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Audit Logs Page ──────────────────────────────────────────────────────────

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch verifications from API
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/verifications");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: VerificationRecord[] = await res.json();

        const mapped: AuditEntry[] = data.map((v, i) => ({
          id: v._id || String(i),
          creditId: v.creditId,
          riskScore: v.riskScore,
          status: v.status,
          timestamp: typeof v.timestamp === "string" ? v.timestamp : new Date(v.timestamp).toISOString(),
          txHash: v.txHash,
          projectName: v.metadata.projectName,
          registry: v.metadata.registry,
          flags: v.flags,
        }));

        setLogs(mapped);
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.creditId.toLowerCase().includes(search.toLowerCase()) ||
      log.projectName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["all", "High Risk", "Medium Risk", "Low Risk"];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-white mb-1">Audit Logs</h1>
        <p className="text-sm text-white/40">
          Complete history of all carbon credit verifications
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Search by Credit ID or Project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-white/[0.03] border-white/8 text-white placeholder:text-white/25 focus-visible:ring-emerald-500/30"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && <TableSkeleton />}

      {/* Table */}
      {!loading && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-medium text-white/30 uppercase tracking-wider">
            <div className="col-span-3">Credit ID</div>
            <div className="col-span-3 hidden sm:block">Project</div>
            <div className="col-span-2">Risk Score</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 hidden md:block text-right">Time</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/[0.03]">
            <AnimatePresence>
              {filtered.map((log, i) => (
                <motion.button
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedLog(log)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 w-full text-left hover:bg-white/[0.02] transition-colors group cursor-pointer"
                >
                  <div className="col-span-3">
                    <code className="text-sm text-emerald-400/80 font-mono group-hover:text-emerald-400 transition-colors">
                      {log.creditId}
                    </code>
                  </div>
                  <div className="col-span-3 hidden sm:block text-sm text-white/50 truncate">
                    {log.projectName}
                  </div>
                  <div className="col-span-2">
                    <ScoreBar score={log.riskScore} />
                  </div>
                  <div className="col-span-2">
                    <StatusBadge status={log.status} />
                  </div>
                  <div className="col-span-2 hidden md:flex items-center justify-end gap-1 text-xs text-white/30">
                    <Calendar className="h-3 w-3" />
                    {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && !loading && (
            <div className="py-12 text-center">
              <Filter className="h-8 w-8 mx-auto text-white/10 mb-3" />
              <p className="text-white/30 text-sm">
                {logs.length === 0
                  ? "No verifications yet. Verify a credit to see it here."
                  : "No results found"}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Summary */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-xs text-white/20 text-right"
        >
          {filtered.length} of {logs.length} records
        </motion.div>
      )}

      {/* Detail Modal */}
      <DetailModal
        log={selectedLog}
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
