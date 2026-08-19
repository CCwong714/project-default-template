export type TIzanamiProject = {
  description: string
  href: string
  image: string
  imageMobile: string
  lead: string
  number: string
  title: 'Craft' | 'Retreat' | 'School'
}

export const NAV_ITEMS = [
  { href: '#top', label: 'home' },
  { href: '#philosophy', label: 'philosophy' },
  { href: '#projects', label: 'projects' },
  { href: '#company', label: 'company' },
  { href: '#contact', label: 'contact' },
] as const

export const PROJECT_SUBNAV = [
  { href: '#school', label: 'school' },
  { href: '#craft', label: 'craft' },
  { href: '#craft', label: 'izanami space' },
  { href: '#retreat', label: 'retreat' },
] as const

export const PROJECTS: readonly TIzanamiProject[] = [
  {
    description:
      'Through “Mama School” over 20,000 families across Japan have been supported. A place where the wishes of both parent and child are gently met.',
    href: '#school',
    image: '/assets/izanami/images/home_projects_img01.webp',
    imageMobile: '/assets/izanami/images/sp_home_projects_img01.webp',
    lead: 'Nurturing the foundations of life.',
    number: '01',
    title: 'School',
  },
  {
    description:
      'In Japan, beauty has always been a form of awareness. We carry this into objects and spaces of quiet refinement — rooted in the spirit of harmony, centered in Dubai.',
    href: '#craft',
    image: '/assets/izanami/images/home_projects_img02.webp',
    imageMobile: '/assets/izanami/images/sp_home_projects_img02.webp',
    lead: 'Awakening the senses through Japanese aesthetics.',
    number: '02',
    title: 'Craft',
  },
  {
    description:
      'Rooted in ancient Mayan plant, Izanami offers private ceremonies for a return to one’s original senses and way of being. Guided by founder Moca, unfolding across the world.',
    href: '#retreat',
    image: '/assets/izanami/images/home_projects_img03.webp',
    imageMobile: '/assets/izanami/images/sp_home_projects_img03.webp',
    lead: 'Returning to your essence.',
    number: '03',
    title: 'Retreat',
  },
] as const

export const LOCATIONS = [
  {
    lines: ['office m2-368', 'bn complex,', 'al muteena,', 'dubai, uae'],
    name: 'dubai',
  },
  {
    lines: ['n&e bldg. 6f,', '1-12-4 ginza,', 'chuo-ku,', 'tokyo, jpn'],
    name: 'tokyo',
  },
] as const

export const COMPANY_COPY = [
  'No matter how the world changes, what truly enriches human life remains the same. Across Japan, Dubai, and beyond, we nurture life through education, shape daily beauty through craft, and guide a return to oneself through healing.',
  'Across cultures and borders, we carry a way of being — ancient and quietly alive — where one’s inner nature is free to unfold.',
] as const

export const PHILOSOPHY_COPY =
  'Harmony is not something to be created. It is something to be remembered. Guided by the ancient spirit of “和” Wa, Izanami opens a quiet path back to oneself into harmony with who you are, and harmony with the world around you.'
