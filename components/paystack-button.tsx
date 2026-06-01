"use client"

import { useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string
        email: string
        amount: number
        ref: string
        onClose: () => void
        callback: (response: { reference: string }) => void
      }) => { openIframe: () => void }
    }
  }
}

type Props = {
  email: string
  amount: number // kobo
  reference: string
  label: string
  onSuccess: (reference: string) => void
  onClose?: () => void
  disabled?: boolean
}

export function PaystackButton({
  email,
  amount,
  reference,
  label,
  onSuccess,
  onClose,
  disabled,
}: Props) {
  const [scriptReady, setScriptReady] = useState(false)

  function trigger() {
    if (!window.PaystackPop) return
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email,
      amount,
      ref: reference,
      onClose: () => onClose?.(),
      callback: (response) => onSuccess(response.reference),
    })
    handler.openIframe()
  }

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <Button
        className="w-full bg-primary text-black hover:bg-primary/80 font-extrabold tracking-wider"
        onClick={trigger}
        disabled={disabled || !scriptReady}
      >
        {!scriptReady ? "Loading payment…" : label}
      </Button>
    </>
  )
}
