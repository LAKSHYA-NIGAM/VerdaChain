"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Palette, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ── Theme helpers ─────────────────────────────────────────────────────────────

type Theme = "dark" | "dim" | "light";

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  localStorage.setItem("verdachain-theme", theme);
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("verdachain-theme") as Theme) ?? "dark";
}

// ── Toggle component ──────────────────────────────────────────────────────────

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
        enabled ? "bg-emerald-500" : "bg-foreground/10"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Settings Page ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTheme, setActiveTheme] = useState<Theme>("dark");
  const [notifications, setNotifications] = useState({
    highRiskAlerts: true,
    weeklyDigest: true,
    blockchainConfirmations: false,
    systemAlerts: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: true,
    auditLog: true,
  });
  const [saved, setSaved] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const stored = getStoredTheme();
    setActiveTheme(stored);
    applyTheme(stored);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setActiveTheme(theme);
    applyTheme(theme);
    toast.success(`Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved successfully");
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { key: "highRiskAlerts" as const, label: "High Risk Alerts", desc: "Get notified when a credit scores above 65", group: "notifications" as const },
        { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Summary of all verifications every Monday", group: "notifications" as const },
        { key: "blockchainConfirmations" as const, label: "Blockchain Confirmations", desc: "Notify when on-chain transactions confirm", group: "notifications" as const },
        { key: "systemAlerts" as const, label: "System Alerts", desc: "Backend uptime and error notifications", group: "notifications" as const },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { key: "twoFactor" as const, label: "Two-Factor Authentication", desc: "Add an extra layer of login security", group: "security" as const },
        { key: "sessionTimeout" as const, label: "Auto Session Timeout", desc: "Sign out after 30 minutes of inactivity", group: "security" as const },
        { key: "auditLog" as const, label: "Audit Log", desc: "Record all verification and login activity", group: "security" as const },
      ],
    },
  ];

  const getToggleValue = (group: "notifications" | "security", key: string) => {
    if (group === "notifications") return notifications[key as keyof typeof notifications];
    return security[key as keyof typeof security];
  };

  const setToggleValue = (group: "notifications" | "security", key: string, val: boolean) => {
    if (group === "notifications") setNotifications((p) => ({ ...p, [key]: val }));
    else setSecurity((p) => ({ ...p, [key]: val }));
  };

  const themes: { id: Theme; label: string; bg: string; textColor: string; borderStyle: string }[] = [
    {
      id: "dark",
      label: "Dark",
      bg: "#050805",
      textColor: "text-foreground/60",
      borderStyle: "border border-foreground/10",
    },
    {
      id: "dim",
      label: "Dim",
      bg: "#1a1f1a",
      textColor: "text-foreground/60",
      borderStyle: "border border-foreground/10",
    },
    {
      id: "light",
      label: "Light",
      bg: "#f0f4f0",
      textColor: "text-foreground/60",
      borderStyle: "border border-black/10",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-sm text-foreground/40">Configure your VerdaChain preferences</p>
      </motion.div>

      {/* Notification & Security toggles */}
      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + si * 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <section.icon className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">{section.title}</h3>
          </div>
          <div className="space-y-1">
            {section.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-foreground/[0.04] last:border-0">
                <div>
                  <p className="text-sm text-foreground/80 font-medium">{item.label}</p>
                  <p className="text-xs text-foreground/30 mt-0.5">{item.desc}</p>
                </div>
                <Toggle
                  enabled={getToggleValue(item.group, item.key)}
                  onChange={(v) => setToggleValue(item.group, item.key, v)}
                />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Appearance — functional theme switcher */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Appearance</h3>
        </div>
        <p className="text-xs text-foreground/30 mb-5">Choose how the dashboard looks. Changes apply instantly.</p>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <motion.button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative rounded-xl p-3 text-center transition-all cursor-pointer ${
                  isActive
                    ? "border border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                    : "border border-foreground/[0.06] hover:border-foreground/15"
                }`}
              >
                {/* Preview box */}
                <div
                  className={`w-full h-12 rounded-lg mb-2.5 ${theme.borderStyle} overflow-hidden relative`}
                  style={{ backgroundColor: theme.bg }}
                >
                  {/* Mini sidebar strip */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-3 opacity-60"
                    style={{ backgroundColor: theme.id === "light" ? "#d4e8d4" : "#0d120d" }}
                  />
                  {/* Mini content lines */}
                  <div className="absolute left-5 top-2 right-2 space-y-1">
                    <div
                      className="h-1 rounded-full w-3/4"
                      style={{ backgroundColor: theme.id === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)" }}
                    />
                    <div
                      className="h-1 rounded-full w-1/2"
                      style={{ backgroundColor: theme.id === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}
                    />
                    <div
                      className="h-1 rounded-full w-2/3 mt-1"
                      style={{ backgroundColor: "#10b981", opacity: 0.5 }}
                    />
                  </div>
                </div>

                <span className={`text-xs font-medium ${isActive ? "text-emerald-400" : "text-foreground/50"}`}>
                  {theme.label}
                </span>

                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                    <Check className="h-3 w-3 text-black" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Network */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Globe className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Network</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground/80 font-medium">Blockchain Network</p>
            <p className="text-xs text-foreground/30 mt-0.5">Currently connected to Sepolia Testnet</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Sepolia</span>
          </div>
        </div>
      </motion.div>

      {/* Save */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end pb-4"
      >
        <Button
          onClick={handleSave}
          className="h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold cursor-pointer gap-2"
        >
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : "Save Settings"}
        </Button>
      </motion.div>
    </div>
  );
}
