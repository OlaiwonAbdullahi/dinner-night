export type Contestant = {
  id: string;
  name: string;
  tagline: string;
  initial: string;
};

export type VotingCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  contestants: Contestant[];
};

export type TicketTier = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
};

export const votingCategories: VotingCategory[] = [
  {
    id: "tech-rising-star",
    name: "Tech Rising Star of the Year",
    description:
      "Celebrating the most outstanding rising tech talent of the year",
    icon: "star",
    image: "/tech_rising.jpeg",
    contestants: [
      {
        id: "trs-1",
        name: "Adebimpe Abdulsalam",
        tagline: "TechSage",
        initial: "A",
      },
      {
        id: "trs-2",
        name: "Sulaiman Abdussamad",
        tagline: "Codex",
        initial: "S",
      },
      { id: "trs-3", name: "Olaiwon Abdullahi", tagline: "404", initial: "O" },
    ],
  },
  {
    id: "social-impact",
    name: "Social Impact Award",
    description:
      "Honouring those who made a meaningful difference in the community",
    icon: "award",
    image: "/social_impact.jpeg",
    contestants: [
      { id: "si-1", name: "Ojo Samson", tagline: "SF", initial: "O" },
      { id: "si-2", name: "Oladipupo Angel", tagline: "She", initial: "O" },
      {
        id: "si-3",
        name: "Omodewu Olanrewaju",
        tagline: "Lanre",
        initial: "O",
      },
      {
        id: "si-4",
        name: "Adekanmbi Esther",
        tagline: "Boss Lady",
        initial: "A",
      },
    ],
  },
  {
    id: "cruise-commander",
    name: "Cruise Commander of the Year",
    description:
      "Recognising the life of the party who kept everyone entertained",
    icon: "headphones",
    image: "/cruise.jpeg",
    contestants: [
      { id: "cc-1", name: "Iyanda Sodiq", tagline: "Luccavelli", initial: "I" },
      { id: "cc-2", name: "Olobaniyi Robert", tagline: "", initial: "O" },
      { id: "cc-3", name: "Olatunji Daniel", tagline: "", initial: "O" },
      {
        id: "cc-4",
        name: "Omodewu Olanrewaju",
        tagline: "Lanre",
        initial: "O",
      },
    ],
  },
  {
    id: "most-coordinated",
    name: "Most Coordinated and Reserved",
    description: "Celebrating the most put-together and composed individual",
    icon: "group",
    image: "/most_coordinated.jpeg",
    contestants: [
      { id: "mc-1", name: "Farinola Anthonia", tagline: "", initial: "F" },
      { id: "mc-2", name: "Azeez Oluwapelumi", tagline: "", initial: "A" },
      { id: "mc-3", name: "Ojesanmi Emmanuel", tagline: "", initial: "O" },
      { id: "mc-4", name: "Osingunwa Ifeoluwa", tagline: "", initial: "O" },
    ],
  },
  {
    id: "footballer-of-the-year",
    name: "Footballer of the Year",
    description: "Honouring the standout footballer of the year",
    icon: "star",
    image: "/football.jpeg",
    contestants: [
      { id: "foty-1", name: "Al-ameen Bhadmus", tagline: "", initial: "A" },
      { id: "foty-2", name: "Elijah Olakeji", tagline: "Bayu", initial: "E" },
      { id: "foty-3", name: "Akinola Gideon", tagline: "DML", initial: "A" },
      { id: "foty-4", name: "Oladapo Gafar", tagline: "Gafman", initial: "O" },
    ],
  },
  {
    id: "entrepreneur-of-the-year",
    name: "Entrepreneur of the Year",
    description: "Celebrating the most driven and innovative entrepreneur",
    icon: "mic",
    image: "/entrepreneur.jpeg",
    contestants: [
      { id: "enty-1", name: "Ifeoluwa Esther", tagline: "", initial: "I" },
      { id: "enty-2", name: "Oklebe Sharon", tagline: "", initial: "O" },
      {
        id: "enty-3",
        name: "Omodewu Olanrewaju",
        tagline: "Lanre",
        initial: "O",
      },
    ],
  },
  {
    id: "outstanding-leadership",
    name: "Outstanding Leadership",
    description: "Recognising exceptional leadership and influence",
    icon: "award",
    image: "/outstanding_leader.jpeg",
    contestants: [
      { id: "ol-1", name: "Bamigbade Abdulsalam", tagline: "", initial: "B" },
      { id: "ol-2", name: "Taiwo Priscilla", tagline: "", initial: "T" },
      { id: "ol-3", name: "Farinola Anthonia", tagline: "", initial: "F" },
    ],
  },
  {
    id: "scholar-of-the-year",
    name: "Scholar of the Year",
    description: "Honouring academic excellence and intellectual achievement",
    icon: "mic2",
    image: "/scholar.jpeg",
    contestants: [
      { id: "soty-1", name: "Adebimpe Abdulsalam", tagline: "", initial: "A" },
      { id: "soty-2", name: "Adedokun Mubarak", tagline: "", initial: "A" },
      { id: "soty-3", name: "Alonge Adetola", tagline: "", initial: "A" },
      { id: "soty-4", name: "Adetoye Festus", tagline: "", initial: "A" },
    ],
  },
  {
    id: "most-friendly",
    name: "Most Friendly",
    description: "Celebrating the warmest and most welcoming personality",
    icon: "group",
    image: "/most_friendly.jpeg",
    contestants: [
      { id: "mf-1", name: "Ojo Samson", tagline: "", initial: "O" },
      { id: "mf-2", name: "Ifeoluwa Esther", tagline: "", initial: "I" },
      { id: "mf-3", name: "Azeez Abdulsamad", tagline: "", initial: "A" },
      { id: "mf-4", name: "Balogun Kismat", tagline: "", initial: "B" },
    ],
  },
  {
    id: "most-beautiful",
    name: "Most Beautiful",
    description: "Recognising grace, elegance, and natural beauty",
    icon: "mic2",
    image: "/most_beautiful.jpeg",
    contestants: [
      { id: "mb-1", name: "Taiwo Priscilla", tagline: "", initial: "T" },
      { id: "mb-2", name: "Kegbeyale Rebecca", tagline: "", initial: "K" },
      { id: "mb-3", name: "Ganiyu Fatimah", tagline: "", initial: "G" },
      { id: "mb-4", name: "Olujobi Adesewa", tagline: "", initial: "O" },
    ],
  },
  {
    id: "most-handsome",
    name: "Most Handsome",
    description: "Celebrating the most dashing and stylish gentleman",
    icon: "mic",
    image: "/most_handsome.jpeg",
    contestants: [
      { id: "mh-1", name: "Ajayi Farouk", tagline: "", initial: "A" },
      { id: "mh-2", name: "Akintunde Michael", tagline: "", initial: "A" },
      { id: "mh-3", name: "Lawal Tamilore", tagline: "", initial: "L" },
      { id: "mh-4", name: "Alade Felix", tagline: "", initial: "A" },
    ],
  },
];

export const ticketTiers: TicketTier[] = [
  {
    id: "regular",
    name: "Regular",
    price: "₦5,000",
    description: "Standard admission to the gala dinner & awards ceremony",
    features: [
      "General seating",
      "Welcome drink on arrival",
      "Dinner access",
      "Live entertainment & awards show",
    ],
    cta: "Get Regular Ticket",
    highlighted: false,
  },
  {
    id: "volunteer",
    name: "Volunteer",
    price: "₦10,000",
    description:
      "An elevated experience with exclusive perks and priority access",
    features: [
      "Priority seating",
      "3-course plated dinner",
      "Welcome champagne",
      "Red carpet access & photography",

      "Meet & greet opportunity",
    ],
    cta: "Get Volunteer Ticket",
    highlighted: true,
    badge: "Most Popular",
  },
];
