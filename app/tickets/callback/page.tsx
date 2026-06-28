"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { CancelCircleIcon } from "@hugeicons/core-free-icons"

type PendingTicket = {
  reference: string
  tierId: string
  quantity: number
  amount: number
  email: string
  name: string
  phone: string
  department: string
}

type State =
  | { status: "loading" }
  | { status: "error"; reference: string; message: string }

export default function TicketCallbackPage() {
  const router = useRouter()
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get("reference") ?? params.get("trxref") ?? ""

    let pending: PendingTicket | null = null
    try {
      const raw = sessionStorage.getItem("pending_ticket")
      pending = raw ? (JSON.parse(raw) as PendingTicket) : null
    } catch {
      pending = null
    }

    if (!reference) {
      setState({ status: "error", reference: "", message: "No payment reference found." })
      return
    }

    const deadline = Date.now() + 20_000
    let cancelled = false

    function goToReceipt() {
      sessionStorage.removeItem("pending_ticket")
      if (!cancelled) {
        router.replace(`/tickets/receipt/${encodeURIComponent(reference)}`)
      }
    }

    // Try to record the ticket using the details saved before redirect.
    // The endpoint re-verifies the payment with Paystack before saving.
    async function recordViaPending(): Promise<boolean> {
      if (!pending) return false
      try {
        const res = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...pending, reference }),
        })
        return res.ok
      } catch {
        return false
      }
    }

    async function run() {
      if (await recordViaPending()) {
        goToReceipt()
        return
      }

      // Fallback: the Paystack webhook records the ticket server-side, so poll
      // until it appears (covers refreshed/abandoned sessions with no stored details).
      while (!cancelled && Date.now() < deadline) {
        try {
          const res = await fetch(`/api/tickets?reference=${encodeURIComponent(reference)}`)
          if (res.ok) {
            goToReceipt()
            return
          }
        } catch {
          // network blip — keep trying
        }
        await new Promise((r) => setTimeout(r, 2500))
      }

      if (!cancelled) {
        setState({
          status: "error",
          reference,
          message:
            "We couldn't confirm your ticket automatically. If your payment was deducted, your ticket will be recorded shortly — save your reference below and contact support if it doesn't appear.",
        })
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [router])

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-sm text-white/50">Confirming your ticket…</p>
          <p className="text-xs text-white/25">This may take a few seconds</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
            <HugeiconsIcon icon={CancelCircleIcon} size={36} color="currentColor" className="text-red-400" />
          </div>
        </div>
        <h1 className="text-xl font-extrabold text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-white/40">{state.message}</p>
        {state.reference && (
          <p className="mt-3 rounded-lg border border-white/8 bg-white/5 px-4 py-2 font-mono text-xs text-white/40">
            {state.reference}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/tickets"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-primary/80 transition-colors"
          >
            Back to Tickets
          </Link>
        </div>
      </div>
    </div>
  )
}
