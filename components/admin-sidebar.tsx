"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  ThumbsUpIcon,
  Ticket01Icon,
  Menu01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  Building04Icon,
} from "@hugeicons/core-free-icons"
import { AdminLogoutButton } from "@/components/admin-logout-button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Overview", icon: DashboardSquare01Icon },
  { href: "/admin/votes", label: "Votes", icon: ThumbsUpIcon },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket01Icon },
  { href: "/admin/bulk-verify", label: "Bulk Verify", icon: CheckmarkBadge01Icon },
    // { href: "/admin/department-ticket", label: "Department Tickets",  icon: Building04Icon }, 
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  return (
    <>
      <Link
        href="/admin"
        onClick={onClose}
        className="mb-8 flex items-center gap-2"
      >
        <span className="text-xs font-extrabold tracking-widest text-white">
          CSC&apos;29 Admin
        </span>
      </Link>

      <p className="mb-4 text-[10px] font-bold tracking-widest text-white/20 uppercase">
        Menu
      </p>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              pathname === href
                ? "bg-primary/10 text-primary"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            )}
          >
            <HugeiconsIcon icon={icon} size={16} color="currentColor" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/5 pt-4">
        <AdminLogoutButton />
      </div>
    </>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-white/5 bg-card/50 px-4 py-6">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-white/5 bg-black/95 backdrop-blur-md px-4">
        <span className="text-xs font-extrabold tracking-widest text-white">
          CSC&apos;29 <span className="text-primary">Admin</span>
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-primary/30 hover:text-primary transition-all"
        >
          <HugeiconsIcon
            icon={open ? Cancel01Icon : Menu01Icon}
            size={16}
            color="currentColor"
          />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer panel */}
      <div
        className={cn(
          "md:hidden fixed top-14 left-0 bottom-0 z-40 w-64 flex flex-col border-r border-white/5 bg-black px-4 py-6 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onClose={() => setOpen(false)} />
      </div>
    </>
  )
}
