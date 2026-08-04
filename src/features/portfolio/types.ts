export type TPortfolioMode = 'list' | 'spiral'

export type TPortfolioProject = Readonly<{
  aspectRatio: number
  behanceUrl: string | null
  description: string
  image: string
  playbackId: string
  slug: string
  title: string
  year: number
}>

export type TSocialLink = Readonly<{
  href: string
  icon: 'behance' | 'instagram' | 'linkedin' | 'x'
  label: string
}>

export type THelixSnapshot = Readonly<{
  activeIndex: number
  isMoving: boolean
}>
