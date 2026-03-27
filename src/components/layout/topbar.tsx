"use client";

import { Wallet, Bell, ChevronDown, LogOut, User, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Topbar() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("verdachain-auth");
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const handleWalletConnect = () => {
    setWalletConnected(!walletConnected);
    if (!walletConnected) {
      toast.success("Wallet connected", {
        description: "0x7a3b...9f2e",
      });
    } else {
      toast("Wallet disconnected");
    }
  };

  const notifications = [
    { id: 1, text: "VCU-12345 flagged as High Risk", time: "2m ago", unread: true },
    { id: 2, text: "New verification completed", time: "10m ago", unread: true },
    { id: 3, text: "System audit check passed", time: "1h ago", unread: false },
  ];

  return (
    <header className="relative z-50 h-16 flex items-center justify-between px-6 lg:px-8 border-b border-white/5 bg-[#0a0e0a]/60 backdrop-blur-xl">
      {/* Left spacer for mobile menu */}
      <div className="lg:hidden w-10" />

      {/* Page area */}
      <div className="hidden lg:block" />

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5 text-white/50" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 glass-strong rounded-2xl border border-white/[0.06] shadow-2xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <h4 className="text-sm font-semibold text-white">Notifications</h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-white/40" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer border-b border-white/[0.03] last:border-0"
                    >
                      <div className="flex items-start gap-2">
                        {n.unread && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        )}
                        <div className={n.unread ? "" : "ml-4"}>
                          <p className="text-sm text-white/80">{n.text}</p>
                          <p className="text-xs text-white/30 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wallet Connect */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleWalletConnect}
            variant="outline"
            className={`
              h-9 gap-2 text-sm font-medium rounded-xl border transition-all duration-300 cursor-pointer
              ${
                walletConnected
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06]"
              }
            `}
          >
            <Wallet className="h-4 w-4" />
            {walletConnected ? (
              <span className="hidden sm:inline">0x7a3b...9f2e</span>
            ) : (
              <span className="hidden sm:inline">Connect Wallet</span>
            )}
          </Button>
        </motion.div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center text-xs font-bold text-white">
              VC
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-white/40 hidden sm:block" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-52 glass-strong rounded-2xl border border-white/[0.06] shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-white/5">
                  <p className="text-sm font-medium text-white">VerdaChain User</p>
                  <p className="text-xs text-white/30">user@verdachain.com</p>
                </div>
                <div className="p-1.5">
                  <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white/80 hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white/80 hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <div className="h-px bg-white/5 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
