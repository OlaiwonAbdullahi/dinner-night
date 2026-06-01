export function SectionHeader({
  label,
  title,
  sub,
}: {
  label: string
  title: string
  sub: string
}) {
  return (
    <div className="text-center">
      <div className="mb-3 inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-primary/70 uppercase">
        <span className="h-px w-8 bg-primary/40" />
        {label}
        <span className="h-px w-8 bg-primary/40" />
      </div>
      <h2 className="text-[clamp(1.75rem,5vw,2.75rem)] font-extrabold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-white/35">{sub}</p>
    </div>
  )
}
