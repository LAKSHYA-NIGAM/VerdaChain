"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ── Valid credentials ────────────────────────────────────────────────────────
const VALID_CREDENTIALS = {
  email: "admin@verdachain.com",
  password: "verdachain2026",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const emailMatch = email.trim().toLowerCase() === VALID_CREDENTIALS.email;
    const passwordMatch = password === VALID_CREDENTIALS.password;

    if (!emailMatch || !passwordMatch) {
      setLoading(false);
      setError("Invalid email or password. Please check your credentials.");
      toast.error("Authentication failed");
      return;
    }

    localStorage.setItem(
      "verdachain-auth",
      JSON.stringify({
        email: VALID_CREDENTIALS.email,
        name: "VerdaChain Admin",
        loggedInAt: new Date().toISOString(),
      })
    );

    toast.success("Welcome back!", {
      description: `Signed in as ${VALID_CREDENTIALS.email}`,
    });

    setLoading(false);
    router.push("/dashboard/verify");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-emerald-950/10 animated-gradient" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.04] blur-[100px]" />
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl gradient-emerald flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 w-11 h-11 rounded-xl gradient-emerald blur-lg opacity-40" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Verda<span className="text-emerald-400">Chain</span>
          </span>
        </div>

        {/* Login Card */}
        <div className="glass-strong rounded-3xl p-8 glow-border">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-sm text-white/40">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="admin@verdachain.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="pl-10 h-11 rounded-xl bg-white/[0.04] border-white/8 text-white placeholder:text-white/20 focus-visible:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className="pl-10 pr-10 h-11 rounded-xl bg-white/[0.04] border-white/8 text-white placeholder:text-white/20 focus-visible:ring-emerald-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-all disabled:opacity-50 cursor-pointer glow-emerald"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>

          {/* Credential hint */}
          <div className="mt-6 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-xs text-white/30 text-center font-medium mb-1">Demo credentials</p>
            <p className="text-xs text-emerald-400/60 text-center font-mono">admin@verdachain.com</p>
            <p className="text-xs text-emerald-400/60 text-center font-mono">verdachain2026</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
