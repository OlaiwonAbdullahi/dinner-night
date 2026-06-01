import { prisma } from "@/lib/prisma";
import { votingCategories } from "@/lib/data";

async function getStats() {
  const [
    totalVoteCount,
    voteRevenue,
    totalTicketCount,
    ticketRevenue,
    topVotes,
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
      take: 5,
    }),
  ]);

  return {
    totalVoteCount,
    totalVotesPlaced: voteRevenue._sum.quantity ?? 0,
    voteRevenueKobo: voteRevenue._sum.amount ?? 0,
    totalTicketCount,
    ticketRevenueKobo: ticketRevenue._sum.amount ?? 0,
    topVotes,
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

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Overview
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Live dashboard — Dinner Night Awards 2026
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value, sub }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/8 bg-card p-5"
          >
            <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
              {label}
            </p>
            <p className="mt-2 text-3xl font-extrabold text-primary">{value}</p>
            <p className="mt-1 text-xs text-white/30">{sub}</p>
          </div>
        ))}
      </div>

      {/* Top voted */}
      <div className="rounded-2xl border border-white/8 bg-card p-6">
        <h2 className="mb-4 text-sm font-bold text-white">
          Top Voted Nominees
        </h2>
        {stats.topVotes.length === 0 ? (
          <p className="text-sm text-white/30">No votes recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.topVotes.map((v, i) => {
              const cat = votingCategories.find((c) => c.id === v.categoryId);
              const contestant = cat?.contestants.find(
                (c) => c.id === v.contestantId,
              );
              return (
                <div
                  key={`${v.categoryId}-${v.contestantId}`}
                  className="flex items-center gap-4"
                >
                  <span className="w-6 text-xs font-bold text-white/20">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {contestant?.name ?? v.contestantId}
                    </p>
                    <p className="text-xs text-white/30">
                      {cat?.name ?? v.categoryId}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-primary">
                    {(v._sum.quantity ?? 0).toLocaleString()} votes
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
