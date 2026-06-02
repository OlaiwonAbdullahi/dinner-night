"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { RefreshIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [spun, setSpun] = useState(false)

  function handleRefresh() {
    setSpun(true)
    startTransition(() => router.refresh())
    setTimeout(() => setSpun(false), 600)
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/40 hover:border-primary/30 hover:text-primary transition-all disabled:opacity-50"
    >
      <HugeiconsIcon
        icon={RefreshIcon}
        size={13}
        color="currentColor"
        className={cn("transition-transform duration-500", (spun || isPending) && "rotate-180")}
      />
      Refresh
    </button>
  )
}
