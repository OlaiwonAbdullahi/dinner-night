"use client"

import { useEffect, useState } from "react"
import { VOTING_DEADLINE } from "@/lib/data"

function getTimeLeft() {
  const diff = VOTING_DEADLINE.getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export function VotingCountdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeLeft())
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Avoid hydration mismatch — render nothing meaningful until mounted
  if (!mounted) return null

  if (!timeLeft) {
    return (
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-red-400 uppercase">
        Voting Closed
      </div>
    )
  }

  return (
    <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-bold text-primary">
      <span className="tracking-[0.2em] uppercase">Voting closes in</span>
      <div className="flex items-center gap-1.5 font-mono">
        <TimeBox value={timeLeft.days} label="d" />
        <span>:</span>
        <TimeBox value={timeLeft.hours} label="h" />
        <span>:</span>
        <TimeBox value={timeLeft.minutes} label="m" />
        <span>:</span>
        <TimeBox value={timeLeft.seconds} label="s" />
      </div>
    </div>
  )
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <span>
      {String(value).padStart(2, "0")}
      <span className="text-[10px] text-primary/60">{label}</span>
    </span>
  )
}