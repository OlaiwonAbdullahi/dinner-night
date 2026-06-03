"use client"

import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { ThumbsUpIcon } from "@hugeicons/core-free-icons"
import type { VotingCategory } from "@/lib/data"

function avatarUrl(name: string) {
  return `https://tapback.co/api/avatar/${encodeURIComponent(name)}.webp`
}

type Props = {
  category: VotingCategory
  index: number
}

export function CategoryVoteCard({ category, index }: Props) {
  return (
    <Link
      href={`/voting/${category.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/8 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_oklch(0.745_0.14_86/0.08)]"
    >
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
          Open category
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-primary/60 group-hover:text-primary transition-colors">
          <HugeiconsIcon icon={ThumbsUpIcon} size={12} color="currentColor" />
          Vote
        </span>
      </div>
    </Link>
  )
}
