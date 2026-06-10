import { prisma } from "@/lib/prisma"
import { ticketTiers } from "@/lib/data"
import { RefreshButton } from "@/components/admin-refresh-button"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

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

// Completely optional/loose structure to stop the compiler from strict-checking searchParams structures at build time
export default async function AdminTicketsPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  // Await safely with a fallback empty object
  const resolvedParams = (await props.searchParams) || {}
  
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : undefined
  const department = typeof resolvedParams.department === "string" ? resolvedParams.department : undefined

  const tickets = await prisma.ticket.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(department === "set" ? { department: { not: null } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  const totals = await prisma.ticket.aggregate({
    where: { status: "paid" },
    _sum: { amount: true },
    _count: true,
  })

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Tickets</h1>
          <p className="mt-1 text-sm text-white/40">
            {totals._count} sold · {formatNaira(totals._sum.amount ?? 0)} revenue
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <RefreshButton />

          {/* Status filters */}
          <a 
            href="/admin/tickets"
            className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-all ${
              !status && !department
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-white/10 text-white/50 hover:border-primary/30 hover:text-primary"
            }`}
          >
            All
          </a>

          <a
            href="/admin/tickets?status=paid"
            className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-all ${
              status === "paid"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-white/10 text-white/50 hover:border-primary/30 hover:text-primary"
            }`}
          >
            Paid
          </a>
          
          <a 
            href="/admin/tickets?status=pending"
            className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-all ${
              status === "pending"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-white/10 text-white/50 hover:border-primary/30 hover:text-primary"
            }`}
          >
            Pending
          </a>
          
          <a 
            href="/admin/tickets?status=failed"
            className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-all ${
              status === "failed"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-white/10 text-white/50 hover:border-primary/30 hover:text-primary"
            }`}
          >
            Failed
          </a>

          {/* Department filter */}
          <a 
            href={department === "set" ? "/admin/tickets" : "/admin/tickets?department=set"}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
              department === "set"
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-white/10 text-white/50 hover:border-primary/30 hover:text-primary"
            }`}
          >
            Has Department
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-card/50">
              {["Name", "Email", "Department", "Phone", "Tier", "Amount", "Reference", "Status", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-white/30 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-white/30">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => {
                const tier = ticketTiers.find((t) => t.id === ticket.tierId)
                return (
                  <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{ticket.name}</td>
                    <td className="px-4 py-3 text-white/50">{ticket.email}</td>
                    <td className="px-4 py-3">
                      {ticket.department ? (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {ticket.department}
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/50">{ticket.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${tier?.highlighted ? "border-primary/40 bg-primary/10 text-primary" : "border-white/10 text-white/40"}`}>
                        {tier?.name ?? ticket.tierId}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-primary">{formatNaira(ticket.amount)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-white/30">{ticket.reference.slice(0, 16)}…</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[ticket.status] ?? STATUS_STYLES.pending}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/30">{formatDate(ticket.createdAt)}</td>
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