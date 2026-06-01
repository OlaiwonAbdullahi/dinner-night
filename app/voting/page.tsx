import { HugeiconsIcon } from "@hugeicons/react";
import { FireIcon } from "@hugeicons/core-free-icons";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { CategoryVoteCard } from "@/components/category-vote-card";
import { AnimateIn } from "@/components/animate-in";
import { votingCategories } from "@/lib/data";

export const metadata = {
  title: "Vote — Dinner Night Awards 2026",
  description: "Cast your vote for the nominees across all 6 award categories.",
};

export default function VotingPage() {
  return (
    <div className="flex min-h-full flex-col bg-black text-white">
      <Navbar />

      {/* Page header */}
      <section className="relative overflow-hidden pt-32 pb-16 px-4">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.745 0.14 86 / 0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
            <HugeiconsIcon icon={FireIcon} size={12} color="currentColor" />
            Voting is now open
          </div>
          <h1
            className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold tracking-tighter text-white"
            style={{
              fontFamily: "var(--font-display)",
            }}
          >
            Cast Your <span className="text-primary">Vote</span>
          </h1>
          <p className="mt-4 text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Click any category below, choose your favourite nominee, and cast
            your vote. ₦50 per vote · minimum ₦100.
          </p>
        </div>
      </section>

      {/* Categories grid */}
      <section className="flex-1 px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {votingCategories.map((cat, idx) => (
              <AnimateIn key={cat.id} delay={(idx % 3) * 100} direction="up">
                <CategoryVoteCard category={cat} index={idx} />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
