"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckoutForm, type CheckoutValues } from "@/components/checkout-form"

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string
        email: string
        amount: number
        ref: string
        onClose: () => void
        callback: (r: { reference: string }) => void
      }) => { openIframe: () => void }
    }
  }
}

type Step = "checkout" | "paying" | "success"

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
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("checkout")
  const [checkoutValues, setCheckoutValues] = useState<CheckoutValues | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const paystackRef = useRef<string | null>(null)

  function resetDialog() {
    setStep("checkout")
    paystackRef.current = null
    setCheckoutValues(null)
    setIsLoading(false)
    setErrorMsg(null)
  }

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v && step !== "paying" && step !== "success") {
      resetDialog()
    }
  }

  // Close dialog → then trigger Paystack
  useEffect(() => {
    if (!open && step === "paying" && paystackRef.current && checkoutValues) {
      const ref = paystackRef.current
      const email = checkoutValues.email
      const timer = setTimeout(() => {
        if (!window.PaystackPop) {
          setErrorMsg("Payment system not loaded. Please refresh and try again.")
          setStep("checkout")
          setOpen(true)
          return
        }
        window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
          email,
          amount: priceKobo,
          ref,
          onClose: () => {
            setStep("checkout")
            setOpen(true)
          },
          callback: (response) => {
            void (async () => {
              await handlePaymentSuccess(response.reference)
            })()
          },
        }).openIframe()
      }, 350)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step])

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
      paystackRef.current = data.reference
      setStep("paying")
      setOpen(false) // ← close dialog so Paystack is not blocked
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async (reference: string) => {
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

      // Ticket recorded, but receipt page requires `ticket.status === "paid"`.
      // To ensure the DB update is visible before navigation, add a slightly
      // longer delay (and avoid showing a broken/Not Found receipt).
      setStep("success")
      setTimeout(() => router.push(`/tickets/receipt/${reference}`), 2500)
    } catch {
      setErrorMsg("Payment received but ticket recording failed. Please contact support.")
      setStep("checkout")
      setOpen(true)
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

        {step === "success" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={30} color="currentColor" className="text-primary" />
            </div>
            <p className="text-base font-bold text-white">Ticket Confirmed!</p>
            <p className="text-sm text-white/40">
              Redirecting to your ticket…
            </p>
          </div>
        )}

        {step === "paying" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="text-sm text-white/50">Opening payment…</p>
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
