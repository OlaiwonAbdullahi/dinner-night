"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons"
import { votingCategories } from "@/lib/data"

type PendingVote = {
  reference: string
  categoryId: string
  contestantId: string
  quantity: number
  amount: number
  email: string
  name: string
  phone: string
}

type State =
  | { status: "loading" }
  | { status: "success"; vote: PendingVote; categoryName: string; contestantName: string }
  | { status: "confirmed"; reference: string }
  | { status: "error"; reference: string; message: string }

export default function VotingCallbackPage() {
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get("reference") ?? params.get("trxref") ?? ""

    if (!reference) {
      setState({ status: "error", reference: "", message: "No payment reference found." })
      return
    }

    const raw = sessionStorage.getItem("pending_vote")
    sessionStorage.removeItem("pending_vote")

    async function confirm() {
      if (!raw) {
        // Webhook likely already created the record — just confirm
        setState({ status: "confirmed", reference })
        return
      }

      const pending: PendingVote = JSON.parse(raw)
      const cat = votingCategories.find((c) => c.id === pending.categoryId)
      const contestant = cat?.contestants.find((c) => c.id === pending.contestantId)

      try {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...pending, reference }),
        })
        if (!res.ok) {
          const d = await res.json()
          throw new Error(d.error ?? "Failed to record vote")
        }
        setState({
          status: "success",
          vote: { ...pending, reference },
          categoryName: cat?.name ?? pending.categoryId,
          contestantName: contestant?.name ?? pending.contestantId,
        })
      } catch (err) {
        setState({
          status: "error",
          reference,
          message: err instanceof Error ? err.message : "Something went wrong.",
        })
      }
    }

    confirm()
  }, [])

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-sm text-white/50">Confirming your vote…</p>
        </div>
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
              <HugeiconsIcon
                icon={CancelCircleIcon}
                size={36}
                color="currentColor"
                className="text-red-400"
              />
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-white/40">{state.message}</p>
          {state.reference && (
            <p className="mt-3 font-mono text-xs text-white/25">Ref: {state.reference}</p>
          )}
          <p className="mt-3 text-xs text-white/30">
            If your payment was deducted, contact support with the reference above.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/voting"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-primary/80 transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (state.status === "confirmed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <HugeiconsIcon
                icon={CheckmarkCircle01Icon}
                size={36}
                color="currentColor"
                className="text-primary"
              />
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-white">Vote Confirmed!</h1>
          <p className="mt-2 text-sm text-white/40">Your vote has been recorded.</p>
          <p className="mt-3 font-mono text-xs text-white/25">Ref: {state.reference}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/voting"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-primary/80 transition-colors"
            >
              Vote Again
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/40 hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // state.status === "success" — full receipt
  const { vote, categoryName, contestantName } = state
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <HugeiconsIcon
                icon={CheckmarkCircle01Icon}
                size={36}
                color="currentColor"
                className="text-primary"
              />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Vote Confirmed!</h1>
          <p className="mt-1 text-sm text-white/40">Your vote has been recorded.</p>
        </div>

        {/* Receipt card */}
        <div className="overflow-hidden rounded-2xl border border-primary/25 bg-card">
          <div className="bg-primary px-5 py-3">
            <p
              className="text-[10px] font-extrabold tracking-[0.25em] text-black uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Vote Receipt — CSC&apos;29
            </p>
          </div>

          <div className="divide-y divide-white/5 px-5 py-1">
            <ReceiptRow label="Category" value={categoryName} />
            <ReceiptRow label="Voted For" value={contestantName} highlight />
            <ReceiptRow label="Votes" value={vote.quantity.toLocaleString()} />
            <ReceiptRow
              label="Amount Paid"
              value={`₦${(vote.amount / 100).toLocaleString()}`}
              highlight
            />
          </div>

          <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
            <span className="text-[10px] text-white/25 uppercase tracking-widest">Reference</span>
            <span className="font-mono text-xs text-white/30">
              {vote.reference.slice(-12).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link
            href="/voting"
            className="flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-black hover:bg-primary/80 transition-colors"
          >
            Vote Again
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-center text-sm text-white/40 hover:text-white transition-colors"
          >
            Home
          </Link>
        </div>

        <p className="mt-4 text-center text-[10px] text-white/20 tracking-wider uppercase">
          Dinner &amp; Award Night · 2026
        </p>
      </div>
    </div>
  )
}

function ReceiptRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">{label}</span>
      <span className={`text-sm font-bold ${highlight ? "text-primary" : "text-white"}`}>
        {value}
      </span>
    </div>
  )
}
