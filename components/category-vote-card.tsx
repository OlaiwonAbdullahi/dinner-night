"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Share01Icon,
  PlusSignIcon,
  MinusSignIcon,
  CheckmarkCircle01Icon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckoutForm, type CheckoutValues } from "@/components/checkout-form"
import { cn } from "@/lib/utils"
import type { VotingCategory } from "@/lib/data"

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

const PRICE_PER_VOTE = 50
const MIN_VOTES = 2

type Step = "select" | "checkout" | "paying" | "success"

function avatarUrl(name: string) {
  return `https://tapback.co/api/avatar/${encodeURIComponent(name)}.webp`
}

type Props = {
  category: VotingCategory
  index: number
}

export function CategoryVoteCard({ category, index }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("select")
  const [selected, setSelected] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(MIN_VOTES)
  const [checkoutValues, setCheckoutValues] = useState<CheckoutValues | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const paystackRef = useRef<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const paymentCallbackFired = useRef(false)

  const total = quantity * PRICE_PER_VOTE
  const totalKobo = total * 100
  const selectedContestant = category.contestants.find((c) => c.id === selected)

  function resetDialog() {
    setStep("select")
    setSelected(null)
    setQuantity(MIN_VOTES)
    paystackRef.current = null
    setCheckoutValues(null)
    setIsLoading(false)
    setErrorMsg(null)
  }

  function handleOpenChange(v: boolean) {
    setOpen(v)
    // Only reset when user manually closes — not during payment flow
    if (!v && step !== "paying" && step !== "success") {
      resetDialog()
    }
  }

  // Close dialog first, THEN trigger Paystack — avoids Radix pointer-events blocking
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
        paymentCallbackFired.current = false
        window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
          email,
          amount: totalKobo,
          ref,
          onClose: () => {
            // Paystack fires onClose after callback on success too — only reopen if payment didn't complete
            if (!paymentCallbackFired.current) {
              setStep("checkout")
              setOpen(true)
            }
          },
          callback: (response) => {
            paymentCallbackFired.current = true
            void handlePaymentSuccess(response.reference)
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
          amount: totalKobo,
          metadata: {
            type: "vote",
            categoryId: category.id,
            contestantId: selected,
            quantity,
            name: values.name,
            phone: values.phone ?? "",
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to initialize payment")
      setCheckoutValues(values)
      paystackRef.current = data.reference
      setStep("paying")
      setOpen(false) // ← close dialog so Paystack iframe is not blocked
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePaymentSuccess(reference: string) {
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: category.id,
          contestantId: selected,
          quantity,
          amount: totalKobo,
          email: checkoutValues!.email,
          name: checkoutValues!.name,
          phone: checkoutValues!.phone,
          reference,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? "Failed to record vote")
      }
      setStep("success")
      setOpen(true) // reopen dialog to show receipt
      setShowToast(true)
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setShowToast(false), 5000)
    } catch {
      setErrorMsg("Payment received but vote recording failed. Please contact support.")
      setStep("checkout")
      setOpen(true)
    }
  }

  return (
    <>
      {/* ── Success toast ── */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-black/95 px-5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color="currentColor" className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Vote Submitted!</p>
              <p className="text-xs text-white/50">
                You voted for{" "}
                <span className="text-primary">{selectedContestant?.name}</span>
                {" "}· {quantity} vote{quantity !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-white/30 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        {/* ── Card ── */}
        <DialogTrigger asChild>
          <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_oklch(0.745_0.14_86/0.08)]">
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest text-white/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-white group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex -space-x-2.5">
                {category.contestants.slice(0, 4).map((c, i) => (
                  <div
                    key={c.id}
                    style={{ zIndex: 4 - i }}
                    className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-card bg-card"
                  >
                    <img src={avatarUrl(c.name)} alt={c.name} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-white/30">{category.contestants.length} nominees</span>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
              <span className="text-[10px] font-bold tracking-widest text-primary/50 uppercase">
                ₦{PRICE_PER_VOTE.toLocaleString()}/vote · min ₦{(PRICE_PER_VOTE * MIN_VOTES).toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-primary/60 group-hover:text-primary transition-colors">
                <HugeiconsIcon icon={ThumbsUpIcon} size={12} color="currentColor" />
                Vote
              </span>
            </div>
          </div>
        </DialogTrigger>

        {/* ── Dialog ── */}
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Left image */}
            <div className="relative hidden sm:block w-72 shrink-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover rounded-l-2xl"
                sizes="288px"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/60 rounded-l-2xl" />
            </div>

            {/* Right content */}
            <div className="flex flex-col flex-1 p-6">
              <DialogHeader>
                <div className="mb-1 text-[10px] font-bold tracking-[0.25em] text-primary/60 uppercase">
                  Award Category
                </div>
                <DialogTitle className="uppercase tracking-wide leading-tight">
                  {category.name}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 mb-5 flex items-center justify-between">
                <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/50 hover:border-primary/30 hover:text-primary transition-all">
                  <HugeiconsIcon icon={Share01Icon} size={13} color="currentColor" />
                  Share
                </button>
                <div className="text-right">
                  <span className="text-xs text-white/30">per vote</span>
                  <p className="text-sm font-extrabold text-primary">₦{PRICE_PER_VOTE.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-4 h-px bg-white/5" />

              {errorMsg && (
                <p className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {errorMsg}
                </p>
              )}

              {/* Step: select */}
              {step === "select" && (
                <>
                  <p className="mb-3 text-[11px] font-semibold tracking-wider text-white/30 uppercase">Select a nominee</p>
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {category.contestants.map((c) => {
                      const isSelected = selected === c.id
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelected(c.id)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all",
                            isSelected ? "border-primary/60 bg-primary/8" : "border-white/8 bg-white/3 hover:border-white/20"
                          )}
                        >
                          <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all", isSelected ? "border-primary bg-primary" : "border-white/20")}>
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
                          </span>
                          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-card">
                            <img src={avatarUrl(c.name)} alt={c.name} className="h-full w-full object-cover" />
                          </div>
                          <span className={cn("truncate text-xs font-semibold leading-tight", isSelected ? "text-white" : "text-white/60")}>
                            {c.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mb-4 h-px bg-white/5" />

                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/50">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setQuantity((q) => Math.max(MIN_VOTES, q - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-primary/40 hover:text-primary transition-all">
                        <HugeiconsIcon icon={MinusSignIcon} size={14} color="currentColor" />
                      </button>
                      <span className="w-6 text-center text-sm font-extrabold text-white">{quantity}</span>
                      <button onClick={() => setQuantity((q) => Math.min(99, q + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-primary/40 hover:text-primary transition-all">
                        <HugeiconsIcon icon={PlusSignIcon} size={14} color="currentColor" />
                      </button>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary text-black hover:bg-primary/80 font-extrabold tracking-wider"
                    onClick={() => setStep("checkout")}
                    disabled={!selected}
                  >
                    Continue — ₦{total.toLocaleString()}
                  </Button>
                </>
              )}

              {/* Step: checkout */}
              {step === "checkout" && (
                <CheckoutForm
                  totalLabel={`₦${total.toLocaleString()}`}
                  isLoading={isLoading}
                  onBack={() => setStep("select")}
                  onSubmit={handleCheckoutSubmit}
                />
              )}

              {/* Step: success receipt */}
              {step === "success" && (
                <div className="flex flex-col gap-5">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} size={26} color="currentColor" className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Vote Confirmed!</p>
                      <p className="text-xs text-white/40">Your vote has been recorded.</p>
                    </div>
                  </div>

                  {/* Receipt card */}
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Category</span>
                      <span className="text-sm font-semibold text-white">{category.name}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Voted For</span>
                      <span className="text-sm font-bold text-primary">{selectedContestant?.name}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Votes</span>
                      <span className="text-sm font-semibold text-white">{quantity}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Amount Paid</span>
                      <span className="text-sm font-bold text-primary">₦{total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">Reference</span>
                      <span className="font-mono text-xs text-white/30">{paystackRef.current?.slice(-10)?.toUpperCase()}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary text-black hover:bg-primary/80 font-bold"
                    onClick={() => { setOpen(false); resetDialog() }}
                  >
                    Done
                  </Button>
                </div>
              )}

              {/* Step: paying (loading state while dialog closes + Paystack opens) */}
              {step === "paying" && (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                  <p className="text-sm text-white/50">Opening payment…</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
