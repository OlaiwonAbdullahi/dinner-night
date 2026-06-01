"use client"

import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, ThumbsUpIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { VotingCategory } from "@/lib/data"

type VoteResult = {
  contestantId: string
  percentages: Record<string, number>
}

function generatePercentages(
  contestants: VotingCategory["contestants"],
  votedId: string
): Record<string, number> {
  const weights = contestants.map((c) =>
    c.id === votedId ? Math.random() * 30 + 25 : Math.random() * 25 + 5
  )
  const total = weights.reduce((a, b) => a + b, 0)
  const result: Record<string, number> = {}
  let remaining = 100
  contestants.forEach((c, i) => {
    if (i === contestants.length - 1) {
      result[c.id] = remaining
    } else {
      const pct = Math.round((weights[i] / total) * 100)
      result[c.id] = pct
      remaining -= pct
    }
  })
  return result
}

export function VotingSection({ category }: { category: VotingCategory }) {
  const storageKey = `vote_${category.id}`
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setVoteResult(JSON.parse(stored))
      } catch {
        // ignore invalid stored data
      }
    }
  }, [storageKey])

  function handleVote(contestantId: string) {
    if (voteResult) return
    const percentages = generatePercentages(category.contestants, contestantId)
    const result: VoteResult = { contestantId, percentages }
    setVoteResult(result)
    localStorage.setItem(storageKey, JSON.stringify(result))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {category.contestants.map((contestant) => {
        const hasVoted = !!voteResult
        const isVoted = voteResult?.contestantId === contestant.id
        const pct = voteResult?.percentages[contestant.id] ?? 0

        return (
          <div
            key={contestant.id}
            className={cn(
              "relative flex flex-col items-center rounded-2xl border p-6 transition-all duration-300",
              isVoted
                ? "border-primary/60 bg-primary/5 shadow-[0_0_24px_oklch(0.745_0.14_86/0.12)]"
                : "border-white/10 bg-card",
              hasVoted && !isVoted && "opacity-50"
            )}
          >
            {isVoted && (
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
            <div
              className={cn(
                "mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold tracking-tight select-none",
                isVoted
                  ? "bg-primary text-black"
                  : "bg-primary/10 text-primary border border-primary/20"
              )}
            >
              {contestant.initial}
            </div>

            <h3 className="text-center text-sm font-bold text-white leading-tight">
              {contestant.name}
            </h3>
            <p className="mt-1 mb-5 text-center text-xs text-white/40 leading-snug">
              {contestant.tagline}
            </p>

            {mounted && hasVoted ? (
              <div className="w-full">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className={cn("font-medium", isVoted ? "text-primary" : "text-white/30")}>
                    {isVoted ? "Your vote" : "Votes"}
                  </span>
                  <span className={cn("font-bold", isVoted ? "text-primary" : "text-white/30")}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      isVoted ? "bg-primary" : "bg-white/20"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-black font-semibold transition-all"
                onClick={() => handleVote(contestant.id)}
                disabled={!mounted}
              >
                <HugeiconsIcon icon={ThumbsUpIcon} size={14} color="currentColor" />
                Vote
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}
