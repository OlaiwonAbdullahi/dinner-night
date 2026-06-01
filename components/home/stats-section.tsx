import { AnimateIn } from "@/components/animate-in"

const stats = [
  { value: "6", label: "Award Categories" },
  { value: "24", label: "Nominees" },
  { value: "500+", label: "Expected Guests" },
]

export function StatsSection() {
  return (
    <section className="border-y border-white/5 bg-card/40 py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-3">
        {stats.map(({ value, label }, i) => (
          <AnimateIn key={label} delay={i * 100} direction="up">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-primary">{value}</span>
              <span className="mt-1 text-[10px] font-semibold tracking-widest text-white/30 uppercase">
                {label}
              </span>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  )
}
