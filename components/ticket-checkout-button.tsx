"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckoutForm, type CheckoutValues } from "@/components/checkout-form"
import { PaystackButton } from "@/components/paystack-button"

type Step = "checkout" | "pay" | "success"

type Props = {
  tierId: string
  tierName: string
  priceLabel: string     // e.g. "₦5,000"
  priceKobo: number      // e.g. 500000
  ctaLabel: string
  highlighted?: boolean
}

export function TicketCheckoutButton({
  tierId,
  tierName,
  priceLabel,
  priceKobo,
  ctaLabel,
  highlighted,
}: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("checkout")
  const [paystackRef, setPaystackRef] = useState<string | null>(null)
  const [checkoutValues, setCheckoutValues] = useState<CheckoutValues | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function resetDialog() {
    setStep("checkout")
    setPaystackRef(null)
    setCheckoutValues(null)
    setIsLoading(false)
    setErrorMsg(null)
  }

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v) resetDialog()
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
          metadata: { tierId, tierName, name: values.name },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to initialize payment")
      setCheckoutValues(values)
      setPaystackRef(data.reference)
      setStep("pay")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePaymentSuccess(reference: string) {
    setIsLoading(true)
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId,
          quantity: 1,
          amount: priceKobo,
          email: checkoutValues!.email,
          name: checkoutValues!.name,
          phone: checkoutValues!.phone,
          reference,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? "Failed to record ticket")
      }
      setStep("success")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
      setStep("checkout")
    } finally {
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
          <DialogTitle className="text-lg">
            Complete Your Purchase
          </DialogTitle>
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

        {step === "success" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={30} color="currentColor" className="text-primary" />
            </div>
            <p className="text-base font-bold text-white">Ticket Confirmed!</p>
            <p className="text-sm text-white/40">
              Your <span className="text-primary font-semibold">{tierName}</span> ticket has been booked. Check your email for details.
            </p>
            <Button
              className="mt-2 bg-primary text-black hover:bg-primary/80 font-bold"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        ) : step === "checkout" ? (
          <CheckoutForm
            totalLabel={priceLabel}
            isLoading={isLoading}
            onBack={() => setOpen(false)}
            onSubmit={handleCheckoutSubmit}
          />
        ) : (
          paystackRef && checkoutValues && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-white/40">
                Complete your <span className="font-bold text-primary">{priceLabel}</span> payment securely via Paystack.
              </p>
              <PaystackButton
                email={checkoutValues.email}
                amount={priceKobo}
                reference={paystackRef}
                label={`Pay ${priceLabel}`}
                onSuccess={handlePaymentSuccess}
                onClose={() => setStep("checkout")}
                disabled={isLoading}
              />
              <button
                onClick={() => setStep("checkout")}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                ← Back
              </button>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}
