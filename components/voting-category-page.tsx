import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Award01Icon,
  Mic01Icon,
  Mic02Icon,
  HeadphonesIcon,
  GroupIcon,
  StarAward01Icon,
} from "@hugeicons/core-free-icons"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { VotingSection } from "@/components/voting-section"
import type { VotingCategory } from "@/lib/data"

const iconMap: Record<string, typeof Mic01Icon> = {
  mic: Mic01Icon,
  mic2: Mic02Icon,
  headphones: HeadphonesIcon,
  group: GroupIcon,
  star: StarAward01Icon,
  award: Award01Icon,
}

type Props = {
  category: VotingCategory
  categoryIndex: number
  highlightContestantId?: string | null
}

export function VotingCategoryPage({
  category,
  categoryIndex,
  highlightContestantId,
}: Props) {
  const Icon = iconMap[category.icon] ?? Award01Icon

  return (
    <div className="flex min-h-full flex-col bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-12 px-4">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.745 0.14 86 / 0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl">
          <Link
            href="/voting"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 hover:text-primary transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} color="currentColor" />
            Back to Categories
          </Link>

          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <HugeiconsIcon icon={Icon} size={26} color="currentColor" className="text-primary" />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-[0.25em] text-primary/60 uppercase">
                Category {String(categoryIndex + 1).padStart(2, "0")}
              </p>
              <h1 className="text-[clamp(1.8rem,6vw,3.5rem)] font-extrabold tracking-tight text-white leading-tight">
                {category.name}
              </h1>
              <p className="mt-2 text-sm text-white/40 max-w-lg">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs text-white/25 tracking-wide">
              Select one nominee to cast your vote
            </p>
            <span className="text-xs text-white/20">{category.contestants.length} nominees</span>
          </div>
          <VotingSection category={category} highlightContestantId={highlightContestantId} />
        </div>
      </section>

      <Footer />
    </div>
  )
}