import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { VotingPreview } from "@/components/home/voting-preview"
import { TicketsPreview } from "@/components/home/tickets-preview"

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col bg-black text-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <VotingPreview />
      <div className="mx-auto max-w-6xl w-full px-4">
        <div className="h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      </div>
      <TicketsPreview />
      <Footer />
    </div>
  )
}
