import { notFound } from "next/navigation"
import { VotingCategoryPage } from "@/components/voting-category-page"
import { votingCategories } from "@/lib/data"
import { slugify } from "@/lib/utils"

export async function generateStaticParams() {
  return votingCategories.flatMap((category) =>
    category.contestants.map((contestant) => ({
      category: category.id,
      nominee: slugify(contestant.name),
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; nominee: string }>
}) {
  const { category, nominee } = await params
  const cat = votingCategories.find((c) => c.id === category)
  const contestant = cat?.contestants.find((c) => slugify(c.name) === nominee)

  return {
    title: cat && contestant ? `${contestant.name} in ${cat.name} — Dinner Night Awards 2026` : "Vote",
    description: cat?.description,
  }
}

export default async function NomineePage({
  params,
}: {
  params: Promise<{ category: string; nominee: string }>
}) {
  const { category, nominee } = await params
  const cat = votingCategories.find((c) => c.id === category)

  if (!cat) notFound()

  const contestant = cat.contestants.find((c) => slugify(c.name) === nominee)

  if (!contestant) notFound()

  return <VotingCategoryPage category={cat} categoryIndex={votingCategories.indexOf(cat)} highlightContestantId={contestant.id} />
}
