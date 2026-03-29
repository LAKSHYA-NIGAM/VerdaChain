"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ScrollText,
  BarChart3,
  X,
  Menu,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard/verify", label: "Verify Credit", icon: ShieldCheck },
  { href: "/dashboard/audit", label: "Audit Logs", icon: ScrollText },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("verdachain-auth");
    router.push("/login");
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href="/" className="flex items-center px-4 py-6">
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
      </Link>

      {/* Separator */}
      <div className="mx-4 h-px bg-white/5" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl bg-emerald-500/10 glow-border"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 relative z-10 transition-colors",
                  isActive ? "text-emerald-400" : ""
                )}
              />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 pb-6 space-y-3">
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-white/40 mb-1">Network Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">
              Sepolia Testnet
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden glass rounded-lg p-2"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: mobileOpen ? 0 : -280 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed top-0 left-0 bottom-0 w-[260px] z-50 lg:hidden bg-sidebar border-r border-white/5"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {navContent}
      </motion.aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-shrink-0 flex-col bg-sidebar/80 border-r border-white/5 backdrop-blur-xl">
        {navContent}
      </aside>
    </>
  );
}
