import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  Calendar01Icon,
  Location01Icon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16">
      {/* background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% -5%, oklch(0.745 0.14 86 / 0.18) 0%, transparent 70%)",
        }}
      />
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.745 0.14 86) 1px, transparent 1px), linear-gradient(90deg, oklch(0.745 0.14 86) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex max-w-4xl flex-col items-center px-4 text-center">
        {/* pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
          <HugeiconsIcon icon={SparklesIcon} size={12} color="currentColor" />
          Annual Awards Ceremony 2026
        </div>

        {/* event name */}
        <h1
          className="mb-2 leading-[1.05] tracking-tight text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.2rem, 12vw, 7.5rem)",
            fontWeight: 600,
            fontStyle: "italic",
          }}
        >
          Dinner &amp; Award
          <br />
          <span
            className="text-primary"
            style={{ fontStyle: "normal", fontWeight: 700 }}
          >
            Night
          </span>
        </h1>

        <p className="mb-10 text-[11px] font-semibold tracking-[0.5em] text-white/30 uppercase">
          An Evening of Excellence &amp; Glamour
        </p>

        {/* event details row */}
        <div className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-8 text-sm text-white/40">
          <span className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Calendar01Icon}
              size={15}
              color="currentColor"
              className="text-primary"
            />
            June 18, 2026

          </span>
          <span className="hidden sm:block h-4 w-px bg-primary/20" />
          <span className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Location01Icon}
              size={15}
              color="currentColor"
              className="text-primary"
            />
            Antimaggies event center, Yoaco Ogbomosho
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="bg-primary text-black hover:bg-primary/80 font-bold tracking-wider px-8"
          >
            <Link href="/voting">Cast Your Vote</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-white/15 text-white hover:border-primary/40 hover:bg-white/5 tracking-wider px-8"
          >
            <Link href="/tickets">
              <HugeiconsIcon icon={Ticket01Icon} size={16} color="currentColor" />
              Get Tickets
            </Link>
          </Button>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="mx-auto h-10 w-px bg-linear-to-b from-primary/40 to-transparent" />
      </div>
    </section>
  )
}
