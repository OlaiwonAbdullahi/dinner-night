"use client"

import { useState, useEffect, useRef } from "react"
import Script from "next/script"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckoutForm, type CheckoutValues } from "@/components/checkout-form"
import { sponsorPresets } from "@/lib/data"

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

type Step = "amount" | "checkout" | "paying" | "success"

type Props = {
  ctaLabel: string
}

export function SponsorCheckoutButton({ ctaLabel }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("amount")

  // Amount selection state
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [amountError, setAmountError] = useState<string | null>(null)

  const [checkoutValues, setCheckoutValues] = useState<CheckoutValues | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const paystackRef = useRef<string | null>(null)

  // Compute the final kobo amount
  const resolvedKobo: number | null = (() => {
    if (selectedPreset !== null) return selectedPreset
    const parsed = parseInt(customAmount.replace(/,/g, ""), 10)
    if (!isNaN(parsed) && parsed >= 100) return parsed * 100 // naira → kobo
    return null
  })()

  const resolvedLabel: string = (() => {
    if (resolvedKobo === null) return "₦0"
    return `₦${(resolvedKobo / 100).toLocaleString("en-NG")}`
  })()

  function resetDialog() {
    setStep("amount")
    setSelectedPreset(null)
    setCustomAmount("")
    setAmountError(null)
    setCheckoutValues(null)
    setIsLoading(false)
    setErrorMsg(null)
    paystackRef.current = null
  }

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v && step !== "paying" && step !== "success") {
      resetDialog()
    }
  }

  function handlePresetClick(kobo: number) {
    setSelectedPreset(kobo)
    setCustomAmount("")
    setAmountError(null)
  }

  function handleCustomAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    setCustomAmount(raw)
    setSelectedPreset(null)
    setAmountError(null)
  }

  function handleAmountContinue() {
    if (resolvedKobo === null) {
      setAmountError("Please select a preset or enter an amount of at least ₦100.")
      return
    }
    setAmountError(null)
    setStep("checkout")
  }

  // Once dialog closes with step === "paying", open Paystack
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
        // define callback as inline async to avoid lint "access before declared"
        window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
          email,
          amount: resolvedKobo!,
          ref,
          onClose: () => {
            setStep("checkout")
            setOpen(true)
          },
          callback: (response) => {
            void (async () => {
              const reference = response.reference
              try {
                const res = await fetch("/api/tickets", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    tierId: "sponsor",
                    quantity: 1,
                    amount: resolvedKobo!,
                    email: checkoutValues.email,
                    name: checkoutValues.name,
                    phone: checkoutValues.phone,
                    department: checkoutValues!.department,   // ← ADD
                    reference,
                  }),
                })

                if (!res.ok) {
                  const d = await res.json()
                  throw new Error(d.error ?? "Failed to record sponsorship")
                }

                setStep("success")
                setTimeout(() => router.push(`/tickets/receipt/${reference}`), 1200)
              } catch {
                setErrorMsg(
                  "Payment received but sponsorship recording failed. Please contact support.",
                )
                setStep("checkout")
                setOpen(true)
              }
            })()
          },
        }).openIframe()
      }, 350)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step])

  async function handleCheckoutSubmit(values: CheckoutValues) {
    if (resolvedKobo === null) return
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          amount: resolvedKobo,
          metadata: { tierId: "sponsor", tierName: "Sponsor", name: values.name },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to initialize payment")
      setCheckoutValues(values)
      paystackRef.current = data.reference
      setStep("paying")
      setOpen(false)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePaymentSuccess(reference: string) {
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId: "sponsor",
          quantity: 1,
          amount: resolvedKobo,
          email: checkoutValues!.email,
          name: checkoutValues!.name,
          phone: checkoutValues!.phone,
          reference,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? "Failed to record sponsorship")
      }
      setStep("success")
      setTimeout(() => router.push(`/tickets/receipt/${reference}`), 1200)
    } catch {
      setErrorMsg("Payment received but sponsorship recording failed. Please contact support.")
      setStep("checkout")
      setOpen(true)
    }
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="w-full border border-primary/30 bg-transparent text-primary hover:bg-primary/10"
          >
            {ctaLabel}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mb-1 text-[10px] font-bold tracking-[0.25em] text-primary/60 uppercase">
              Sponsor Ticket
            </div>
            <DialogTitle>Choose Your Sponsorship Amount</DialogTitle>
          </DialogHeader>

          {errorMsg && (
            <p className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {errorMsg}
            </p>
          )}

          {/* ── Step: Amount picker ── */}
          {step === "amount" && (
            <div className="space-y-5">
              {/* Preset buttons */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                  Select an amount
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {sponsorPresets.map((preset) => (
                    <button
                      key={preset.kobo}
                      type="button"
                      onClick={() => handlePresetClick(preset.kobo)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition
                        ${
                          selectedPreset === preset.kobo
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-white/10 bg-white/5 text-white/70 hover:border-primary/40 hover:text-white"
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 text-white/20">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-widest">or enter custom</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Custom amount input */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                  Custom amount (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white/40">
                    ₦
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="e.g. 75000"
                    className="w-full rounded-2xl border border-white/10 bg-black/80 py-3 pl-8 pr-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {amountError && (
                  <p className="mt-2 text-xs text-red-400">{amountError}</p>
                )}
              </div>

              {/* Summary + continue */}
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <span className="text-sm text-white/50">You are sponsoring</span>
                <span className="font-extrabold text-primary">{resolvedLabel}</span>
              </div>

              <Button
                onClick={handleAmountContinue}
                disabled={resolvedKobo === null}
                className="w-full bg-primary font-bold text-black hover:bg-primary/80 disabled:opacity-50"
              >
                Continue →
              </Button>
            </div>
          )}

          {/* ── Step: Checkout form ── */}
          {step === "checkout" && (
            <>
              <div className="mb-4 flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <span className="text-sm text-white/60">Sponsorship amount</span>
                <span className="font-extrabold text-primary">{resolvedLabel}</span>
              </div>
              <CheckoutForm
                totalLabel={resolvedLabel}
                isLoading={isLoading}
                onBack={() => setStep("amount")}
                onSubmit={handleCheckoutSubmit}
              />
            </>
          )}

          {/* ── Step: Paying ── */}
          {step === "paying" && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              <p className="text-sm text-white/50">Opening payment…</p>
            </div>
          )}

          {/* ── Step: Success ── */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  size={30}
                  color="currentColor"
                  className="text-primary"
                />
              </div>
              <p className="text-base font-bold text-white">Sponsorship Confirmed!</p>
              <p className="text-sm text-white/40">Redirecting to your receipt…</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}