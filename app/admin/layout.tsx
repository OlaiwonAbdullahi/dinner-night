import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  DashboardSquare01Icon,
  ThumbsUpIcon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons"
import { AdminLogoutButton } from "@/components/admin-logout-button"

const navItems = [
  { href: "/admin", label: "Overview", icon: DashboardSquare01Icon },
  { href: "/admin/votes", label: "Votes", icon: ThumbsUpIcon },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket01Icon },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-white/5 bg-card/50 px-4 py-6">
        {/* Logo */}
        <Link href="/admin" className="mb-8 flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} size={16} color="currentColor" className="text-primary" />
          <span className="text-xs font-extrabold tracking-widest text-white">
            DINNER <span className="text-primary">NIGHT</span>
          </span>
        </Link>

        <p className="mb-4 text-[10px] font-bold tracking-widest text-white/20 uppercase">Menu</p>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              <HugeiconsIcon icon={icon} size={16} color="currentColor" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/5 pt-4">
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
