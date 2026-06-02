import { prisma } from "@/lib/prisma";
import { votingCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

const MEDAL = ["🥇", "🥈", "🥉"];

async function getStats() {
  const [
    totalVoteCount,
    voteRevenue,
    totalTicketCount,
    ticketRevenue,
    voteResults,
  ] = await Promise.all([
    prisma.vote.count({ where: { status: "paid" } }),
    prisma.vote.aggregate({
      where: { status: "paid" },
      _sum: { quantity: true, amount: true },
    }),
    prisma.ticket.count({ where: { status: "paid" } }),
    prisma.ticket.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
    }),
    prisma.vote.groupBy({
      by: ["categoryId", "contestantId"],
      where: { status: "paid" },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
    }),
  ]);

  return {
    totalVoteCount,
    totalVotesPlaced: voteRevenue._sum.quantity ?? 0,
    voteRevenueKobo: voteRevenue._sum.amount ?? 0,
    totalTicketCount,
    ticketRevenueKobo: ticketRevenue._sum.amount ?? 0,
    voteResults,
  };
}

function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const statCards = [
    {
      label: "Total Transactions",
      value: stats.totalVoteCount.toLocaleString(),
      sub: "paid vote transactions",
    },
    {
      label: "Votes Placed",
      value: stats.totalVotesPlaced.toLocaleString(),
      sub: "individual votes cast",
    },
    {
      label: "Vote Revenue",
      value: formatNaira(stats.voteRevenueKobo),
      sub: "from voting",
    },
    {
      label: "Tickets Sold",
      value: stats.totalTicketCount.toLocaleString(),
      sub: `revenue: ${formatNaira(stats.ticketRevenueKobo)}`,
    },
  ];

  // Build category → sorted standings map
  const byCategory = new Map<string, { contestantId: string; votes: number }[]>();
  for (const row of stats.voteResults) {
    const votes = row._sum.quantity ?? 0;
    if (!byCategory.has(row.categoryId)) byCategory.set(row.categoryId, []);
    byCategory.get(row.categoryId)!.push({ contestantId: row.contestantId, votes });
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Overview</h1>
        <p className="mt-1 text-sm text-white/40">
          Live dashboard — Dinner Night Awards 2026
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-white/8 bg-card p-5">
            <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
              {label}
            </p>
            <p className="mt-2 text-3xl font-extrabold text-primary">{value}</p>
            <p className="mt-1 text-xs text-white/30">{sub}</p>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Leaderboard</h2>
        <span className="text-[10px] font-bold tracking-widest text-white/25 uppercase">
          {stats.totalVotesPlaced.toLocaleString()} total votes
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {votingCategories.map((cat) => {
          const rows = byCategory.get(cat.id) ?? [];

          const standings = cat.contestants
            .map((c) => ({
              ...c,
              votes: rows.find((r) => r.contestantId === c.id)?.votes ?? 0,
            }))
            .sort((a, b) => b.votes - a.votes);

          const maxVotes = standings[0]?.votes ?? 0;
          const hasVotes = maxVotes > 0;

          return (
            <div key={cat.id} className="overflow-hidden rounded-2xl border border-white/8 bg-card">
              {/* Card header */}
              <div className="border-b border-white/5 px-4 py-3">
                <p className="text-[10px] font-bold tracking-[0.2em] text-primary/50 uppercase">
                  Category
                </p>
                <h3 className="mt-0.5 truncate text-sm font-extrabold uppercase tracking-wide text-white">
                  {cat.name}
                </h3>
              </div>

              {/* Standings */}
              <div className="divide-y divide-white/5 px-4 py-1">
                {standings.map((contestant, rank) => {
                  const pct = hasVotes ? (contestant.votes / maxVotes) * 100 : 0;
                  const isLeading = rank === 0 && hasVotes;

                  return (
                    <div key={contestant.id} className="py-2.5">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="w-5 shrink-0 text-center text-sm leading-none">
                          {rank < 3 && hasVotes ? (
                            MEDAL[rank]
                          ) : (
                            <span className="text-[11px] font-bold text-white/20">
                              {rank + 1}
                            </span>
                          )}
                        </span>
                        <span
                          className={`flex-1 truncate text-xs font-semibold ${
                            isLeading ? "text-white" : "text-white/50"
                          }`}
                        >
                          {contestant.name}
                        </span>
                        <span
                          className={`tabular-nums text-xs font-extrabold ${
                            isLeading ? "text-primary" : "text-white/25"
                          }`}
                        >
                          {contestant.votes.toLocaleString()}
                        </span>
                      </div>
                      <div className="ml-7 h-1 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLeading ? "bg-primary" : "bg-white/10"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {!hasVotes && (
                <p className="px-4 pb-3 text-center text-xs text-white/20">No votes yet</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
