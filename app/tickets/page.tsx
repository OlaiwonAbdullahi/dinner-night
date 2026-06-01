import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Ticket01Icon,
  CrownIcon,
  CheckmarkCircle01Icon,
  Calendar01Icon,
  Location01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { TicketCheckoutButton } from "@/components/ticket-checkout-button"
import { ticketTiers } from "@/lib/data"
import { cn } from "@/lib/utils"

// Price in kobo (₦1 = 100 kobo)
const TIER_PRICES_KOBO: Record<string, number> = {
  regular: 500000,    // ₦5,000
  volunteer: 1000000, // ₦10,000
}

export const metadata = {
  title: "Tickets — Dinner Night Awards 2026",
  description: "Secure your seat at the Annual Dinner Night Awards 2026.",
}

const tierIconMap: Record<string, typeof Ticket01Icon> = {
  regular: Ticket01Icon,
  volunteer: CrownIcon,
}

export default function TicketsPage() {
  return (
    <div className="flex min-h-full flex-col bg-black text-white">
      <Navbar />

      {/* Page header */}
      <section className="relative overflow-hidden pt-32 pb-16 px-4">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.745 0.14 86 / 0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
            <HugeiconsIcon icon={Ticket01Icon} size={12} color="currentColor" />
            Limited Seats Available
          </div>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold tracking-tighter text-white">
            Secure Your <span className="text-primary">Seat</span>
          </h1>
          <p className="mt-4 text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Join us for an unforgettable evening of music, glamour, and celebration. Select the experience that suits you best.
          </p>

          {/* Event details */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-8 sm:justify-center text-sm text-white/40">
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar01Icon} size={15} color="currentColor" className="text-primary" />
              December 12, 2026 · 6:00 PM WAT
            </span>
            <span className="hidden sm:block h-4 w-px bg-primary/20" />
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} size={15} color="currentColor" className="text-primary" />
              Eko Hotel &amp; Suites, Victoria Island
            </span>
          </div>
        </div>
      </section>

      {/* Ticket tiers */}
      <section className="flex-1 px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-2xl mx-auto">
            {ticketTiers.map((tier) => {
              const TierIcon = tierIconMap[tier.id] ?? Ticket01Icon
              return (
                <div
                  key={tier.id}
                  className={cn(
                    "relative flex flex-col rounded-2xl border p-6 transition-all",
                    tier.highlighted
                      ? "border-primary/60 bg-primary/5 shadow-[0_0_50px_oklch(0.745_0.14_86/0.10)]"
                      : "border-white/8 bg-card"
                  )}
                >
                  {tier.badge && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/60 bg-black px-3 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                      {tier.badge}
                    </span>
                  )}

                  {/* Icon + name */}
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        tier.highlighted ? "bg-primary/20" : "bg-primary/10"
                      )}
                    >
                      <HugeiconsIcon icon={TierIcon} size={18} color="currentColor" className="text-primary" />
                    </div>
                    <h2 className="font-extrabold text-white tracking-tight">{tier.name}</h2>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-4xl font-extrabold text-primary leading-none">{tier.price}</span>
                  </div>
                  <p className="mb-6 text-xs text-white/35 leading-relaxed">{tier.description}</p>

                  {/* Features */}
                  <ul className="mb-8 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-white/55">
                        <HugeiconsIcon
                          icon={CheckmarkCircle01Icon}
                          size={13}
                          color="currentColor"
                          className="text-primary shrink-0 mt-0.5"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <TicketCheckoutButton
                    tierId={tier.id}
                    tierName={tier.name}
                    priceLabel={tier.price}
                    priceKobo={TIER_PRICES_KOBO[tier.id] ?? 500000}
                    ctaLabel={tier.cta}
                    highlighted={tier.highlighted}
                  />
                </div>
              )
            })}
          </div>

          {/* Info note */}
          <p className="mt-8 text-center text-xs text-white/20">
            All prices are inclusive of taxes. Tickets are non-refundable. For group bookings or sponsorship enquiries, contact us at{" "}
            <span className="text-primary/50">tickets@dinnernightawards.com</span>
          </p>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="border-t border-white/5 bg-card/30 py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-primary/70 uppercase">
              <span className="h-px w-8 bg-primary/40" />
              Questions
              <span className="h-px w-8 bg-primary/40" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {faqs.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-white/8 bg-card p-5">
                <h3 className="mb-2 text-sm font-bold text-white">{q}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-primary/30 bg-primary/5 p-10 text-center">
          <HugeiconsIcon icon={SparklesIcon} size={32} color="currentColor" className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-white mb-3">Don&apos;t Miss Out</h2>
          <p className="text-sm text-white/40 mb-6 max-w-md mx-auto">
            Seats are filling up fast. Secure your spot at the most glamorous event of the year.
          </p>
          <Link
            href="#tickets"
            className="inline-flex h-10 items-center justify-center rounded-4xl bg-primary px-8 text-sm font-bold tracking-wider text-black hover:bg-primary/80 transition-colors"
          >
            Get Your Ticket Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

const faqs = [
  {
    q: "When do doors open?",
    a: "Doors open at 5:30 PM WAT. The main ceremony begins at 7:00 PM. We recommend arriving by 6:00 PM to enjoy the welcome reception.",
  },
  {
    q: "What is the dress code?",
    a: "Black tie / formal attire. This is a gala event — dress to impress. Traditional formal wear is also welcome.",
  },
  {
    q: "Can I transfer my ticket?",
    a: "Yes, tickets can be transferred to another person up to 48 hours before the event. Contact our support team to process the transfer.",
  },
  {
    q: "Is there parking available?",
    a: "Yes, complimentary valet parking is available at Eko Hotel for all ticket holders. Please bring your ticket for validation.",
  },
]
