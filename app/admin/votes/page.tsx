import { prisma } from "@/lib/prisma"
import { votingCategories } from "@/lib/data"

function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`
}

function formatDate(d: Date) {
  return d.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-500/15 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  failed: "bg-red-500/15 text-red-400 border-red-500/20",
}

export default async function AdminVotesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>
}) {
  const { category, status } = await searchParams

  const votes = await prisma.vote.findMany({
    where: {
      ...(category ? { categoryId: category } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Votes</h1>
          <p className="mt-1 text-sm text-white/40">{votes.length} records shown</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/votes"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:border-primary/30 hover:text-primary transition-all"
          >
            All
          </a>
          {votingCategories.map((cat) => (
            <a
              key={cat.id}
              href={`/admin/votes?category=${cat.id}`}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${category === cat.id ? "border-primary/50 bg-primary/10 text-primary" : "border-white/10 text-white/50 hover:border-primary/30 hover:text-primary"}`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-card/50">
              {["Name", "Email", "Category", "Contestant", "Qty", "Amount", "Status", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-white/30 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {votes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-white/30">
                  No votes found.
                </td>
              </tr>
            ) : (
              votes.map((vote) => {
                const cat = votingCategories.find((c) => c.id === vote.categoryId)
                const contestant = cat?.contestants.find((c) => c.id === vote.contestantId)
                return (
                  <tr key={vote.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{vote.name}</td>
                    <td className="px-4 py-3 text-white/50">{vote.email}</td>
                    <td className="px-4 py-3 text-white/50">{cat?.name ?? vote.categoryId}</td>
                    <td className="px-4 py-3 text-white/70">{contestant?.name ?? vote.contestantId}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary">{vote.quantity}</td>
                    <td className="px-4 py-3 text-white/70">{formatNaira(vote.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[vote.status] ?? STATUS_STYLES.pending}`}>
                        {vote.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/30">{formatDate(vote.createdAt)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
