"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  Menu01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/voting", label: "Vote" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/tickets", label: "Tickets" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Outer wrapper — controls width transition */}
      <div
        className={cn(
          "fixed top-0 z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out",
          scrolled ? "w-full top-0 px-0" : "w-[90%] max-w-5xl top-4 px-0",
        )}
      >
        <nav
          className={cn(
            "relative transition-all duration-500",
            scrolled
              ? "rounded-none border-b border-white/8 bg-black/95 backdrop-blur-xl shadow-none"
              : "rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          )}
        >
          {/* Gold top line — only when floating */}
          {!scrolled && (
            <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          )}

          <div className="flex h-18 items-center justify-between px-5 sm:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <span
                className="text-xs font-extrabold tracking-[0.22em] text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                CSC'29
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative px-4 py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors rounded-lg",
                    pathname === href
                      ? "text-primary"
                      : "text-white/40 hover:text-white hover:bg-white/5",
                  )}
                >
                  {pathname === href && (
                    <span className="absolute inset-x-3 bottom-0.5 h-px bg-primary/60 rounded-full" />
                  )}
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                asChild
                size="sm"
                className="hidden md:inline-flex h-8 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black font-bold tracking-widest text-xs transition-all duration-200"
              >
                <Link href="/voting">Vote Now</Link>
              </Button>

              <button
                className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-primary/30 hover:text-primary transition-all"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                <HugeiconsIcon
                  icon={open ? Cancel01Icon : Menu01Icon}
                  size={17}
                  color="currentColor"
                />
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          {open && (
            <div
              className={cn(
                "md:hidden border-t border-white/5 px-5 pb-5 pt-3",
                !scrolled && "rounded-b-2xl",
              )}
            >
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center py-3 text-xs font-semibold tracking-widest uppercase border-b border-white/5 transition-colors",
                    pathname === href ? "text-primary" : "text-white/40",
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4">
                <Button
                  asChild
                  className="w-full bg-primary text-black hover:bg-primary/80 font-bold tracking-widest text-xs"
                >
                  <Link href="/voting" onClick={() => setOpen(false)}>
                    Vote Now
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
