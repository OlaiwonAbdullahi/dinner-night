export type Contestant = {
  id: string
  name: string
  tagline: string
  initial: string
}

export type VotingCategory = {
  id: string
  name: string
  description: string
  icon: string
  contestants: Contestant[]
}

export type TicketTier = {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
  badge?: string
}

export const votingCategories: VotingCategory[] = [
  {
    id: "best-male-artiste",
    name: "Best Male Artiste",
    description: "Celebrating the most outstanding male artiste of the year",
    icon: "mic",
    contestants: [
      { id: "bma-1", name: "Davido", tagline: "The hitmaker, OBO", initial: "D" },
      { id: "bma-2", name: "Burna Boy", tagline: "The African Giant", initial: "B" },
      { id: "bma-3", name: "Wizkid", tagline: "Machala, Big Wiz", initial: "W" },
      { id: "bma-4", name: "Asake", tagline: "Mr. Money, YBNL", initial: "A" },
    ],
  },
  {
    id: "best-female-artiste",
    name: "Best Female Artiste",
    description: "Honouring the most outstanding female artiste of the year",
    icon: "mic2",
    contestants: [
      { id: "bfa-1", name: "Tiwa Savage", tagline: "The Afrobeats Queen", initial: "T" },
      { id: "bfa-2", name: "Ayra Starr", tagline: "The Rising Superstar", initial: "A" },
      { id: "bfa-3", name: "Tems", tagline: "Icon of Afrobeats", initial: "T" },
      { id: "bfa-4", name: "Yemi Alade", tagline: "Mama Africa", initial: "Y" },
    ],
  },
  {
    id: "best-dj",
    name: "Best DJ",
    description: "Recognising the DJ who kept the vibes alive all year",
    icon: "headphones",
    contestants: [
      { id: "dj-1", name: "DJ Spinall", tagline: "The Cap", initial: "S" },
      { id: "dj-2", name: "DJ Tunez", tagline: "Afrobeats Specialist", initial: "T" },
      { id: "dj-3", name: "DJ Big N", tagline: "The Party Maestro", initial: "B" },
      { id: "dj-4", name: "DJ Neptune", tagline: "The Plug", initial: "N" },
    ],
  },
  {
    id: "best-group",
    name: "Best Group / Duo",
    description: "Celebrating the best musical group or duo this year",
    icon: "group",
    contestants: [
      { id: "grp-1", name: "The Cavemen", tagline: "Highlife revivalists", initial: "C" },
      { id: "grp-2", name: "Show Dem Camp", tagline: "The Palmwine pioneers", initial: "S" },
      { id: "grp-3", name: "Ajebutter22", tagline: "The duo of vibes", initial: "A" },
      { id: "grp-4", name: "BOJ x Odunsi", tagline: "Alternative R&B duo", initial: "B" },
    ],
  },
  {
    id: "best-newcomer",
    name: "Best Newcomer",
    description: "Recognising the most impressive new artiste this year",
    icon: "star",
    contestants: [
      { id: "new-1", name: "Shallipopi", tagline: "Street Anthem King", initial: "S" },
      { id: "new-2", name: "Bloody Civilian", tagline: "The Alternative Voice", initial: "B" },
      { id: "new-3", name: "Fave", tagline: "The Soulful Singer", initial: "F" },
      { id: "new-4", name: "Zinoleesky", tagline: "Street Sensation", initial: "Z" },
    ],
  },
  {
    id: "best-live-performance",
    name: "Best Live Performance",
    description: "Honouring the most electrifying live performance of the year",
    icon: "award",
    contestants: [
      { id: "perf-1", name: "Burna Boy — O2 Arena", tagline: "A record-breaking night", initial: "B" },
      { id: "perf-2", name: "Wizkid — MSG", tagline: "Sold out Madison Square Garden", initial: "W" },
      { id: "perf-3", name: "Davido — Teslim Balogun", tagline: "The 30BG takeover", initial: "D" },
      { id: "perf-4", name: "Fela Tribute Night", tagline: "A legacy remembered", initial: "F" },
    ],
  },
]

export const ticketTiers: TicketTier[] = [
  {
    id: "regular",
    name: "Regular",
    price: "₦5,000",
    description: "Standard admission to the gala dinner & awards ceremony",
    features: [
      "General seating",
      "Welcome drink on arrival",
      "Buffet dinner access",
      "Live entertainment & awards show",
      "Event programme booklet",
    ],
    cta: "Get Regular Ticket",
    highlighted: false,
  },
  {
    id: "volunteer",
    name: "Volunteer",
    price: "₦10,000",
    description: "An elevated experience with exclusive perks and priority access",
    features: [
      "Priority seating",
      "3-course plated dinner",
      "Welcome champagne",
      "Red carpet access & photography",
      "Exclusive gift bag",
      "Meet & greet opportunity",
    ],
    cta: "Get Volunteer Ticket",
    highlighted: true,
    badge: "Most Popular",
  },
]
