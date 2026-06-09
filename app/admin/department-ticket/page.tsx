// import { prisma } from "@/lib/prisma"
// import { ticketTiers } from "@/lib/data"

// export default async function DepartmentTicketsPage() {
//   const tickets = await prisma.ticket.findMany({
//     orderBy: { createdAt: "desc" },
//   })

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-xl font-extrabold text-white tracking-tight">Department Tickets</h1>
//         <p className="text-sm text-white/40 mt-1">All tickets grouped by department</p>
//       </div>

//       <div className="overflow-x-auto rounded-2xl border border-white/8">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-white/8 bg-white/3">
//               <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-white/30 uppercase">Name</th>
//               <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-white/30 uppercase">Email</th>
//               <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-white/30 uppercase">Department</th>
//               <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-white/30 uppercase">Ticket Type</th>
//               <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-white/30 uppercase">Status</th>
//               <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-white/30 uppercase">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tickets.map((t) => {
//               const tier = ticketTiers.find((tier) => tier.id === t.tierId)
//               return (
//                 <tr key={t.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
//                   <td className="px-4 py-3 text-white font-medium">{t.name}</td>
//                   <td className="px-4 py-3 text-white/50">{t.email}</td>
//                   <td className="px-4 py-3">
//                     {t.department ? (
//                       <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
//                         {t.department}
//                       </span>
//                     ) : (
//                       <span className="text-white/20">—</span>
//                     )}
//                   </td>
//                   <td className="px-4 py-3 text-white/70">{tier?.name ?? t.tierId}</td>
//                   <td className="px-4 py-3">
//                     <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
//                       t.status === "paid"
//                         ? "bg-green-500/10 text-green-400 border border-green-500/20"
//                         : "bg-white/5 text-white/30 border border-white/10"
//                     }`}>
//                       {t.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-white/70">₦{(t.amount / 100).toLocaleString()}</td>
//                 </tr>
//               )
//             })}
//             {tickets.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="px-4 py-10 text-center text-sm text-white/20">
//                   No tickets yet.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }