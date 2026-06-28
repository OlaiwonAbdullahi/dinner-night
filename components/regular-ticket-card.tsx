"use client"

import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, Ticket01Icon } from "@hugeicons/core-free-icons"
import { TicketCheckoutButton } from "@/components/ticket-checkout-button"

const REGULAR_PRICE = 500000
const DISCOUNT_PRICE = 400000

const DISCOUNT_START = new Date("2026-06-28T20:00:00.000Z")
const DISCOUNT_END   = new Date("2026-06-28T21:00:00.000Z")

type DiscountStatus = "upcoming" | "active" | "ended"

function getDiscountStatus(): DiscountStatus {
  const now = Date.now()
  if (now < DISCOUNT_START.getTime()) return "upcoming"
  if (now < DISCOUNT_END.getTime()) return "active"
  return "ended"
}

export function RegularTicketCard() {
  const [discounted, setDiscounted] = useState(false)
  const [status, setStatus] = useState<DiscountStatus>("upcoming")

  useEffect(() => {
    function check() {
      const s = getDiscountStatus()
      setStatus(s)
      if (s !== "active") setDiscounted(false)
    }
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [])

  const priceKobo = discounted ? DISCOUNT_PRICE : REGULAR_PRICE
  const priceLabel = discounted ? "₦4,000" : "₦5,000"

  const features = [
    "General seating",
    "Welcome drink on arrival",
    "Dinner access",
    "Live entertainment & awards show",
  ]

  return (
    <div className="relative flex flex-col rounded-2xl border border-white/8 bg-card p-6 transition-all h-full">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <HugeiconsIcon icon={Ticket01Icon} size={18} color="currentColor" className="text-primary" />
        </div>
        <h3 className="font-bold text-white">Regular</h3>
      </div>

      <div className="mb-1 flex items-center gap-2">
        <span className="text-3xl font-extrabold text-primary">{priceLabel}</span>
        {discounted && (
          <span className="text-sm text-white/30 line-through">₦5,000</span>
        )}
      </div>

      <p className="mb-4 text-xs text-white/35 leading-relaxed">
        Standard admission to the gala dinner & awards ceremony
      </p>

      {/* Discount status button */}
      {status === "active" && (
        <button
          type="button"
          onClick={() => setDiscounted((d) => !d)}
          className={`mb-5 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
            discounted
              ? "border-primary/50 bg-primary/15 text-primary"
              : "border-white/10 bg-white/5 text-white/50 hover:border-primary/30 hover:text-primary"
          }`}
        >
          {discounted ? (
            <>
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={13} color="currentColor" />
              Discount Applied — ₦1,000 off!
            </>
          ) : (
            "🎉 Get Discount"
          )}
        </button>
      )}

      {status === "upcoming" && (
        <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-xs font-semibold text-white/30">
          🕐 Discount available Sunday 9PM – 10PM
        </div>
      )}

      {status === "ended" && (
        <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400/60">
          ❌ Discount period has ended
        </div>
      )}

      <ul className="mb-6 flex-1 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-white/50">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={13} color="currentColor" className="text-primary mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <TicketCheckoutButton
        tierId="regular"
        tierName="Regular"
        priceLabel={priceLabel}
        priceKobo={priceKobo}
        ctaLabel="Get Regular Ticket"
        highlighted={false}
      />
    </div>
  )
}