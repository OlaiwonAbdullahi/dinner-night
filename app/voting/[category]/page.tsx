import { notFound } from "next/navigation"
import { VotingCategoryPage } from "@/components/voting-category-page"
import { votingCategories } from "@/lib/data"

export async function generateStaticParams() {
  return votingCategories.map((cat) => ({ category: cat.id }))
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ contestant?: string }>
}) {
  const { category } = await params
  const { contestant } = await searchParams
  const cat = votingCategories.find((c) => c.id === category)
  const nominee = contestant
    ? cat?.contestants.find((c) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === contestant)
    : null
  return {
    title: cat ? `${cat.name}${nominee ? ` · ${nominee.name}` : ""} — Dinner Night Awards 2026` : "Vote",
    description: cat?.description,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ contestant?: string }>
}) {
  const { category } = await params
  const { contestant } = await searchParams
  const cat = votingCategories.find((c) => c.id === category)

  if (!cat) notFound()

  const highlightContestant = contestant
    ? cat.contestants.find((c) =>
        c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === contestant
      )
    : null
  const catIndex = votingCategories.indexOf(cat)
  return <VotingCategoryPage category={cat} categoryIndex={catIndex} highlightContestantId={highlightContestant?.id} />
}
