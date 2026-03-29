"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Shield, Activity, Award, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthData {
  email: string;
  name?: string;
  loggedInAt: string;
}

export default function ProfilePage() {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("verdachain-auth");
    if (raw) {
      const data = JSON.parse(raw) as AuthData;
      setAuth(data);
      setNameInput(data.name ?? "VerdaChain Admin");
    }
  }, []);

  const handleSaveName = () => {
    if (!auth) return;
    const updated = { ...auth, name: nameInput };
    localStorage.setItem("verdachain-auth", JSON.stringify(updated));
    setAuth(updated);
    setEditingName(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = [
    { label: "Credits Verified", value: "142", icon: Activity, color: "text-emerald-400" },
    { label: "Audits On-chain", value: "38", icon: Shield, color: "text-blue-400" },
    { label: "High Risk Flags", value: "17", icon: Award, color: "text-red-400" },
    { label: "Avg Risk Score", value: "61", icon: Activity, color: "text-yellow-400" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
        <p className="text-sm text-white/40">Manage your account information</p>
      </motion.div>

      {/* Avatar + Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl gradient-emerald flex items-center justify-center text-2xl font-bold text-white">
              VC
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
              <Check className="h-3 w-3 text-black" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <div className="flex items-center gap-2 mb-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-lg font-semibold focus:outline-none focus:border-emerald-500/40 w-56"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white">{auth?.name ?? "VerdaChain Admin"}</h2>
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-1 rounded-md hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
            {saved && <p className="text-xs text-emerald-400 mb-1">✓ Name updated</p>}

            {/* Email */}
            <div className="flex items-center gap-2 text-white/50">
              <Mail className="h-3.5 w-3.5" />
              <span className="text-sm">{auth?.email}</span>
            </div>

            {/* Joined */}
            <div className="flex items-center gap-2 text-white/30 mt-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">
                Last signed in:{" "}
                {auth?.loggedInAt
                  ? new Date(auth.loggedInAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                  : "—"}
              </span>
            </div>
          </div>

          {/* Role badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Admin</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.06 }}
            className="glass rounded-2xl p-4 text-center"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/35 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Account Details */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Account Details</h3>
        <div className="space-y-4">
          {[
            { label: "Account Type", value: "Enterprise Auditor" },
            { label: "Organization", value: "VerdaChain Protocol" },
            { label: "Region", value: "Global" },
            { label: "Blockchain Network", value: "Ethereum Sepolia Testnet" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
              <span className="text-sm text-white/40">{item.label}</span>
              <span className="text-sm text-white/80 font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
