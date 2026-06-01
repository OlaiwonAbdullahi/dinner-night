"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"

export function PrintTicketButton({ label = "Print / Save PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-primary/80 transition-colors"
    >
      <HugeiconsIcon icon={Download01Icon} size={16} color="currentColor" />
      {label}
    </button>
  )
}
