"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckoutForm, type CheckoutValues } from "@/components/checkout-form"

type Step = "checkout" | "paying"

type Props = {
  tierId: string
  tierName: string
  priceLabel: string
  priceKobo: number
  ctaLabel: string
  highlighted?: boolean
}

export function TicketCheckoutButton({
  tierId, tierName, priceLabel, priceKobo, ctaLabel, highlighted,
}: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("checkout")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function resetDialog() {
    setStep("checkout")
    setIsLoading(false)
    setErrorMsg(null)
  }

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v && step !== "paying") resetDialog()
  }

  async function handleCheckoutSubmit(values: CheckoutValues) {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          amount: priceKobo,
          callback_url: `${window.location.origin}/tickets/callback`,
          metadata: {
            type: "ticket",
            tierId,
            tierName,
            quantity: 1,
            name: values.name,
            phone: values.phone ?? "",
            department: values.department ?? "",
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to initialize payment")

      // Save ticket details so the callback page can record the ticket and show the receipt
      sessionStorage.setItem(
        "pending_ticket",
        JSON.stringify({
          reference: data.reference,
          tierId,
          quantity: 1,
          amount: priceKobo,
          email: values.email,
          name: values.name,
          phone: values.phone ?? "",
          department: values.department ?? "",
        })
      )

      setStep("paying")
      window.location.href = data.authorization_url
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={
            highlighted
              ? "w-full bg-primary text-black hover:bg-primary/80 font-bold tracking-wide"
              : "w-full border border-primary/30 bg-transparent text-primary hover:bg-primary/10"
          }
        >
          {ctaLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-1 text-[10px] font-bold tracking-[0.25em] text-primary/60 uppercase">
            {tierName} Ticket
          </div>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>

        <div className="mb-4 flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3">
          <span className="text-sm text-white/60">{tierName}</span>
          <span className="font-extrabold text-primary">{priceLabel}</span>
        </div>

        {errorMsg && (
          <p className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {errorMsg}
          </p>
        )}

        {step === "paying" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="text-sm font-semibold text-white">Redirecting to Paystack…</p>
            <p className="text-xs text-white/40">
              You&apos;ll be brought back here after payment.
            </p>
          </div>
        )}

        {step === "checkout" && (
          <CheckoutForm
            totalLabel={priceLabel}
            isLoading={isLoading}
            onBack={() => setOpen(false)}
            onSubmit={handleCheckoutSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
