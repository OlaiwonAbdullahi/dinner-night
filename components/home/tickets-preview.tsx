import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CrownIcon,
  HeartIcon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { ticketTiers } from "@/lib/data"
import { SectionHeader } from "@/components/home/section-header"
import { AnimateIn } from "@/components/animate-in"
import { RegularTicketCard } from "@/components/regular-ticket-card"   // ← ADD
import { TicketCheckoutButton } from "@/components/ticket-checkout-button"
import { SponsorCheckoutButton } from "@/components/sponsor-checkout-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"

const ticketIconMap: Record<string, IconSvgElement> = {
  volunteer: CrownIcon,
  sponsor: HeartIcon,
}

const ticketPriceMap: Record<string, number> = {
  volunteer: 1000000,
}

export function TicketsPreview() {
  const previewTiers = ticketTiers.slice(0, 3)

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          label="Tickets"
          title="Secure Your Seat"
          sub="Choose the experience that best suits you"
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {previewTiers.map((tier, i) => {
            // Regular tier gets its own client component with discount
            if (tier.id === "regular") {
              return (
                <AnimateIn key={tier.id} delay={i * 120} direction="up">
                  <RegularTicketCard />
                </AnimateIn>
              )
            }

            const TierIcon = ticketIconMap[tier.id] ?? HeartIcon
            return (
              <AnimateIn key={tier.id} delay={i * 120} direction="up">
                <div
                  className={cn(
                    "relative flex flex-col rounded-2xl border p-6 transition-all h-full",
                    tier.highlighted
                      ? "border-primary/50 bg-primary/5 shadow-[0_0_40px_oklch(0.745_0.14_86/0.08)]"
                      : "border-white/8 bg-card"
                  )}
                >
                  {tier.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/60 bg-black px-3 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
                      {tier.badge}
                    </span>
                  )}

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <HugeiconsIcon
                        icon={TierIcon}
                        size={18}
                        color="currentColor"
                        className="text-primary"
                      />
                    </div>
                    <h3 className="font-bold text-white">{tier.name}</h3>
                  </div>

                  <div className="mb-1">
                    <span className="text-3xl font-extrabold text-primary">
                      {tier.price}
                    </span>
                  </div>
                  <p className="mb-5 text-xs text-white/35 leading-relaxed">
                    {tier.description}
                  </p>

                  <ul className="mb-6 flex-1 space-y-2">
                    {tier.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-white/50">
                        <HugeiconsIcon
                          icon={CheckmarkCircle01Icon}
                          size={13}
                          color="currentColor"
                          className="text-primary mt-0.5 shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {tier.isSponsor ? (
                    <SponsorCheckoutButton ctaLabel={tier.cta} />
                  ) : (
                    <TicketCheckoutButton
                      tierId={tier.id}
                      tierName={tier.name}
                      priceLabel={tier.price}
                      priceKobo={ticketPriceMap[tier.id] ?? 0}
                      ctaLabel={tier.cta}
                      highlighted={tier.highlighted}
                    />
                  )}
                </div>
              </AnimateIn>
            )
          })}
        </div>

        <AnimateIn delay={200} direction="fade">
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              asChild
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Link href="/tickets">
                View All Ticket Options
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} color="currentColor" />
              </Link>
            </Button>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}