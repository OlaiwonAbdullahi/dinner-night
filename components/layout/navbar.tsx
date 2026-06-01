"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { SparklesIcon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/voting", label: "Vote" },
  { href: "/tickets", label: "Tickets" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} size={18} color="currentColor" className="text-primary" />
          <span className="text-sm font-extrabold tracking-[0.2em] text-white">
            DINNER <span className="text-primary">NIGHT</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium tracking-wider transition-colors",
                pathname === href
                  ? "text-primary"
                  : "text-white/50 hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex bg-primary text-black hover:bg-primary/80 font-bold tracking-wider"
          >
            <Link href="/voting">Vote Now</Link>
          </Button>

          <button
            className="md:hidden rounded-lg p-1.5 text-white/60 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <HugeiconsIcon
              icon={open ? Cancel01Icon : Menu01Icon}
              size={22}
              color="currentColor"
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-black px-4 pb-4 pt-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center py-3 text-sm font-medium tracking-wider border-b border-white/5 transition-colors",
                pathname === href ? "text-primary" : "text-white/50"
              )}
            >
              {label}
            </Link>
          ))}
          <div className="pt-4">
            <Button
              asChild
              className="w-full bg-primary text-black hover:bg-primary/80 font-bold tracking-wider"
            >
              <Link href="/voting" onClick={() => setOpen(false)}>
                Vote Now
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
