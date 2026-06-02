import { prisma } from "@/lib/prisma";
import { votingCategories } from "@/lib/data";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { TrophyIcon, StarIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaderboard — Dinner Night Awards 2026",
  description: "Live vote standings for all categories — Dinner Night Awards 2026.",
};

const MEDAL = ["🥇", "🥈", "🥉"];

export default async function LeaderboardPage() {
  const results = await prisma.vote.groupBy({
    by: ["categoryId", "contestantId"],
    where: { status: "paid" },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
  });

  // Organise into a map: categoryId → sorted contestant rows
  const byCategory = new Map<string, { contestantId: string; votes: number }[]>();
  for (const row of results) {
    const votes = row._sum.quantity ?? 0;
    if (!byCategory.has(row.categoryId)) byCategory.set(row.categoryId, []);
    byCategory.get(row.categoryId)!.push({ contestantId: row.contestantId, votes });
  }

  const totalVotes = results.reduce((s, r) => s + (r._sum.quantity ?? 0), 0);

  return (
    <div className="flex min-h-full flex-col bg-black text-white">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden pt-32 pb-16 px-4">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.745 0.14 86 / 0.14) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
            <HugeiconsIcon icon={TrophyIcon} size={12} color="currentColor" />
            Live Standings
          </div>
          <h1
            className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold tracking-tighter text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Leader<span className="text-primary">board</span>
          </h1>
          <p className="mt-4 text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Live vote standings across all award categories.
            Updates in real time as votes come in.
          </p>
          {totalVotes > 0 && (
            <p className="mt-3 text-xs font-bold tracking-widest text-primary/60 uppercase">
              {totalVotes.toLocaleString()} total votes cast
            </p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="flex-1 px-4 pb-24">
        <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {votingCategories.map((cat) => {
            const rows = byCategory.get(cat.id) ?? [];

            // Merge with all contestants (so unvoted ones still appear at 0)
            const standings = cat.contestants
              .map((c) => ({
                ...c,
                votes: rows.find((r) => r.contestantId === c.id)?.votes ?? 0,
              }))
              .sort((a, b) => b.votes - a.votes);

            const maxVotes = standings[0]?.votes ?? 0;
            const hasVotes = maxVotes > 0;

            return (
              <div
                key={cat.id}
                className="overflow-hidden rounded-2xl border border-white/8 bg-card"
              >
                {/* Card header */}
                <div className="border-b border-white/5 px-5 py-4">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-primary/50 uppercase">
                    Category
                  </p>
                  <h2 className="mt-0.5 text-sm font-extrabold uppercase tracking-wide text-white leading-tight">
                    {cat.name}
                  </h2>
                </div>

                {/* Standings */}
                <div className="divide-y divide-white/5 px-5 py-2">
                  {standings.map((contestant, rank) => {
                    const pct = hasVotes ? (contestant.votes / maxVotes) * 100 : 0;
                    const isLeading = rank === 0 && hasVotes;

                    return (
                      <div key={contestant.id} className="py-3">
                        <div className="mb-1.5 flex items-center gap-2.5">
                          {/* Rank badge */}
                          <span className="w-5 text-center text-sm leading-none">
                            {rank < 3 && hasVotes ? (
                              MEDAL[rank]
                            ) : (
                              <span className="text-[11px] font-bold text-white/20">
                                {rank + 1}
                              </span>
                            )}
                          </span>

                          {/* Name */}
                          <span
                            className={`flex-1 truncate text-sm font-semibold ${
                              isLeading ? "text-white" : "text-white/60"
                            }`}
                          >
                            {contestant.name}
                          </span>

                          {/* Vote count */}
                          <span
                            className={`text-sm font-extrabold tabular-nums ${
                              isLeading ? "text-primary" : "text-white/30"
                            }`}
                          >
                            {contestant.votes.toLocaleString()}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="ml-7 h-1 w-full overflow-hidden rounded-full bg-white/5">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isLeading ? "bg-primary" : "bg-white/15"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* No votes state */}
                {!hasVotes && (
                  <div className="px-5 pb-4 text-center">
                    <HugeiconsIcon
                      icon={StarIcon}
                      size={18}
                      color="currentColor"
                      className="mx-auto mb-1.5 text-white/10"
                    />
                    <p className="text-xs text-white/20">No votes yet</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
