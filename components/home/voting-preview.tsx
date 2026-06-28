import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { CategoryVoteCard } from "@/components/category-vote-card"
import { votingCategories, isVotingClosed } from "@/lib/data"   // ← ADD isVotingClosed
import { SectionHeader } from "@/components/home/section-header"
import { AnimateIn } from "@/components/animate-in"

export function VotingPreview() {
  const previewCategories = votingCategories.slice(0, 3)
  const closed = isVotingClosed()   // ← ADD

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Voting"
          title="Cast Your Vote"
          sub="Choose your favourite nominees across 6 categories"
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previewCategories.map((cat, idx) => (
            <AnimateIn key={cat.id} delay={idx * 120} direction="up">
              <CategoryVoteCard
                category={cat}
                index={idx}
                votingClosed={closed}   // ← ADD
              />
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={200} direction="fade">
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              asChild
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Link href="/voting">
                View All Categories
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} color="currentColor" />
              </Link>
            </Button>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}