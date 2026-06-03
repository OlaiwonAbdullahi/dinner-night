"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, CancelCircleIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { votingCategories } from "@/lib/data"
import { Button } from "@/components/ui/button"

type VoteRecord = {
  categoryId: string
  contestantId: string
  quantity: number
  amount: number
  reference: string
  email: string
  name: string
  createdAt: string
}

type Result =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; vote: VoteRecord; categoryName: string; contestantName: string }
  | { status: "not_found"; message: string }
  | { status: "error"; message: string }

export default function VoteVerifyPage() {
  const [reference, setReference] = useState("")
  const [result, setResult] = useState<Result>({ status: "idle" })

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const ref = reference.trim()
    if (!ref) return

    setResult({ status: "loading" })
    try {
      const res = await fetch(`/api/votes?reference=${encodeURIComponent(ref)}`)
      if (res.ok) {
        const vote: VoteRecord = await res.json()
        const cat = votingCategories.find((c) => c.id === vote.categoryId)
        const contestant = cat?.contestants.find((c) => c.id === vote.contestantId)
        setResult({
          status: "found",
          vote,
          categoryName: cat?.name ?? vote.categoryId,
          contestantName: contestant?.name ?? vote.contestantId,
        })
      } else if (res.status === 402) {
        setResult({ status: "not_found", message: "Payment not confirmed for this reference." })
      } else if (res.status === 404) {
        setResult({ status: "not_found", message: "No vote found with this reference." })
      } else {
        const d = await res.json()
        setResult({ status: "error", message: d.error ?? "Something went wrong." })
      }
    } catch {
      setResult({ status: "error", message: "Network error. Please try again." })
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-black text-white">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-32">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1
              className="text-3xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Verify <span className="text-primary">Your Vote</span>
            </h1>
            <p className="mt-2 text-sm text-white/40">
              Enter your payment reference to confirm your vote was recorded.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleVerify} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. DNA-1748392710384-ABCD1234"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <Button
                type="submit"
                disabled={result.status === "loading" || !reference.trim()}
                className="shrink-0 bg-primary text-black hover:bg-primary/80 font-bold px-5"
              >
                {result.status === "loading" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                ) : (
                  <HugeiconsIcon icon={Search01Icon} size={16} color="currentColor" />
                )}
              </Button>
            </div>
          </form>

          {/* Result */}
          {result.status === "found" && (
            <div className="overflow-hidden rounded-2xl border border-primary/25 bg-card">
              {/* Green header */}
              <div className="flex items-center gap-3 bg-primary px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/20">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color="currentColor" className="text-black" />
                </div>
                <div>
                  <p className="text-xs font-extrabold tracking-widest text-black uppercase">
                    Vote Confirmed
                  </p>
                  <p className="text-[10px] text-black/60">Payment verified successfully</p>
                </div>
              </div>

              <div className="divide-y divide-white/5 px-5 py-1">
                <Row label="Name" value={result.vote.name} />
                <Row label="Category" value={result.categoryName} />
                <Row label="Voted For" value={result.contestantName} highlight />
                <Row label="Votes" value={result.vote.quantity.toLocaleString()} />
                <Row
                  label="Amount Paid"
                  value={`₦${(result.vote.amount / 100).toLocaleString()}`}
                  highlight
                />
                <Row label="Email" value={result.vote.email} />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
                <span className="text-[10px] text-white/25 uppercase tracking-widest">Reference</span>
                <span className="font-mono text-xs text-white/40">
                  {result.vote.reference.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {(result.status === "not_found" || result.status === "error") && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/8 p-5 text-center">
              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
                  <HugeiconsIcon icon={CancelCircleIcon} size={24} color="currentColor" className="text-red-400" />
                </div>
              </div>
              <p className="text-sm font-semibold text-white">Not Found</p>
              <p className="mt-1 text-xs text-white/40">{result.status === "not_found" ? result.message : result.message}</p>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-white/20">
            Your reference is in your payment confirmation or on your vote receipt.
          </p>

          <div className="mt-4 text-center">
            <Link href="/voting" className="text-xs text-primary/60 hover:text-primary transition-colors">
              ← Back to Voting
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-primary" : "text-white/80"}`}>
        {value}
      </span>
    </div>
  )
}
