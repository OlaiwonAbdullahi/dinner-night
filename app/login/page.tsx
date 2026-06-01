"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error ?? "Login failed");
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-card p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
            <HugeiconsIcon
              icon={LockPasswordIcon}
              size={22}
              color="currentColor"
              className="text-primary"
            />
          </div>
          <h2 className="mb-1 text-center text-base font-bold text-white">
            Sign In
          </h2>
          <p className="mb-6 text-center text-xs text-white/30">
            Enter your admin password to continue
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-black hover:bg-primary/80 font-bold tracking-wider"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
