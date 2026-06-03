"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, ThumbsUpIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { slugify } from "@/lib/utils"
import type { VotingCategory } from "@/lib/data"

function avatarUrl(name: string) {
  return `https://tapback.co/api/avatar/${encodeURIComponent(name)}.webp`
}

function toPercentages(
  contestants: VotingCategory["contestants"],
  totals: Record<string, number>
): Record<string, number> {
  const grand = contestants.reduce((sum, c) => sum + (totals[c.id] ?? 0), 0)
  if (grand === 0) return {}
  const result: Record<string, number> = {}
  let remaining = 100
  contestants.forEach((c, i) => {
    if (i === contestants.length - 1) {
      result[c.id] = Math.max(0, remaining)
    } else {
      const pct = Math.round(((totals[c.id] ?? 0) / grand) * 100)
      result[c.id] = pct
      remaining -= pct
    }
  })
  return result
}

export function VotingSection({
  category,
  highlightContestantId,
}: {
  category: VotingCategory
  highlightContestantId?: string | null
}) {
  const [voteTotals, setVoteTotals] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/votes/results")
      .then((r) => r.json())
      .then((data: Record<string, Record<string, number>>) => {
        setVoteTotals(data[category.id] ?? {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category.id])

  const percentages = toPercentages(category.contestants, voteTotals)
  const hasVotes = Object.keys(voteTotals).length > 0
  const leaderId = hasVotes
    ? category.contestants.reduce((best, c) =>
        (voteTotals[c.id] ?? 0) > (voteTotals[best] ?? 0) ? c.id : best,
        category.contestants[0].id
      )
    : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {category.contestants.map((contestant) => {
          const isLeader = leaderId === contestant.id && hasVotes
          const isHighlighted = highlightContestantId === contestant.id
          const pct = percentages[contestant.id] ?? 0
          const voteCount = voteTotals[contestant.id] ?? 0
          const nomineeHref = `/voting/${category.id}/${slugify(contestant.name)}`

          return (
            <Link
              key={contestant.id}
              href={nomineeHref}
              className={cn(
                "relative flex flex-col items-center rounded-2xl border p-6 transition-all duration-300",
                isLeader
                  ? "border-primary/60 bg-primary/5 shadow-[0_0_24px_oklch(0.745_0.14_86/0.12)]"
                  : isHighlighted
                    ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                    : "border-white/10 bg-card"
              )}
            >
              {isLeader && (
                <span className="absolute top-3 right-3">
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    size={18}
                    color="currentColor"
                    className="text-primary"
                  />
                </span>
              )}

              {/* Avatar */}
              <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-white/10">
                <img
                  src={avatarUrl(contestant.name)}
                  alt={contestant.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="text-center text-sm font-bold text-white leading-tight">
                {contestant.name}
              </h3>
              <p className="mt-1 mb-5 text-center text-xs text-white/40 leading-snug">
                {contestant.tagline}
              </p>

              {!loading && hasVotes ? (
                <div className="w-full">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className={cn("font-medium", isLeader ? "text-primary" : "text-white/30")}>
                      {voteCount.toLocaleString()} vote{voteCount !== 1 ? "s" : ""}
                    </span>
                    <span className={cn("font-bold", isLeader ? "text-primary" : "text-white/30")}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        isLeader ? "bg-primary" : "bg-white/20"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className="flex w-full items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-black">
                  <HugeiconsIcon icon={ThumbsUpIcon} size={14} color="currentColor" />
                  Vote
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {!hasVotes && !loading && (
        <p className="text-center text-xs text-white/25">
          No votes yet — be the first to vote on the{" "}
          <Link href="/voting" className="text-primary underline-offset-2 hover:underline">
            voting page
          </Link>
          .
        </p>
      )}
    </div>
  )
}
