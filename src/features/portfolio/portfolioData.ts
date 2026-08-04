import type {
  TPortfolioProject,
  TSocialLink,
} from 'src/features/portfolio/types'

export const portfolioProjects = [
  {
    aspectRatio: 1396 / 770,
    behanceUrl: 'https://www.behance.net/gallery/201777435/Paths-Of-Life',
    description:
      'Paths of Life is a short film about the different paths we take through life; it features a main character and graphic forms that metaphorically and conceptually illustrate the journey of this main character.',
    image: '/assets/pacome/projects/project-01.avif',
    playbackId: '79CoZbPvtdGp00mUU3pkRZujFUDwR02LHciDlc9Gl7G7k',
    slug: 'paths-of-life',
    title: 'Paths of life',
    year: 2024,
  },
  {
    aspectRatio: 3840 / 1920,
    behanceUrl:
      'https://www.behance.net/gallery/221358177/The-disease-spread-on-Tiktok',
    description:
      'Youtube content creator Leo Duff commissioned me for his video “The disease spread on TikTok”, in which he tackles the problem of ADD (attention deficit disorder). The goal was to create an animation that would simplify and popularize how the ADD brain works.',
    image: '/assets/pacome/projects/project-03.avif',
    playbackId: 'tl4p3L4FYyKx6S4j2Vo1ONIsUu1q5QR3YoTvb76f0202o',
    slug: 'the-disease-spread-on-tiktok',
    title: 'The disease spread on Tiktok',
    year: 2024,
  },
  {
    aspectRatio: 1280 / 717,
    behanceUrl:
      'https://www.behance.net/gallery/223730619/Ah-PsychedelicsExplainer',
    description:
      "What if psychedelics weren't just drugs, but medical treatments? This motion design explores the therapeutic potential of psychedelics, using scientific research to deconstruct preconceived ideas.",
    image: '/assets/pacome/projects/project-06.avif',
    playbackId: '4T5ePLKwMgGBHjNGk018tJ198RPD5qEaIIc6HQ02MjF5c',
    slug: 'ah-psychedelics',
    title: 'Ah, Psychedelics',
    year: 2025,
  },
  {
    aspectRatio: 1146 / 644,
    behanceUrl: 'https://www.behance.net/gallery/217440473/Thought',
    description: 'Exploring the emergence of new, spontaneous ideas.',
    image: '/assets/pacome/projects/project-02.avif',
    playbackId: 'xID01eUh12oDNh5MRbAh6fRHQtlq6upbqwinWRzWnE38',
    slug: 'thought',
    title: 'Thought',
    year: 2025,
  },
  {
    aspectRatio: 1413 / 760,
    behanceUrl: null,
    description:
      'Release motion created a few months ago for Jupiter, to mark the launch of their stablecoin.',
    image: '/assets/pacome/projects/project-04.avif',
    playbackId: '00j0002c6600iaejjGj002bhmaJqSlW02PstH7do6QJRPJImM',
    slug: 'jupiter',
    title: 'Jupiter',
    year: 2026,
  },
  {
    aspectRatio: 1258 / 984,
    behanceUrl: 'https://www.behance.net/gallery/238825325/CHROMATIK',
    description:
      'A visual and sound experiment. Shapes, blend tones, and retro tones collide to create a playful study in motion & texture.',
    image: '/assets/pacome/projects/project-05.avif',
    playbackId: '02Bf00ukchvF00C017njOiuDYNLW6HjDDgCFq6FL8eal1k8',
    slug: 'chromatik',
    title: 'Chromatik',
    year: 2025,
  },
  {
    aspectRatio: 1280 / 719,
    behanceUrl: 'https://www.behance.net/gallery/191741223/DIgital-Travel',
    description:
      'A personal project in which a user logs on to his computer ans clicks on a simple play button, leading to the appearance of shapes, colors and anything else that might happen inside a computer while it is loading.',
    image: '/assets/pacome/projects/project-08.avif',
    playbackId: 'ju6elgST7uaWqO9MLc4ODA9V8dkOLmYFdrbSPtXTFaM',
    slug: 'digital-travel',
    title: 'Digital Travel',
    year: 2024,
  },
  {
    aspectRatio: 1920 / 1080,
    behanceUrl: null,
    description:
      'AMG-GT is a 3D motion study project made at school, using Cinema4D and AfterEffects.',
    image: '/assets/pacome/projects/project-07.avif',
    playbackId: 'J6q7eMxUJgjTxJbliCliQSeZtUQYN00iAONNIkyFEZYE',
    slug: 'mercedes-amg',
    title: 'Mercedes AMG',
    year: 2025,
  },
  {
    aspectRatio: 3840 / 2160,
    behanceUrl: 'https://www.behance.net/gallery/221365289/The-purity-revealed',
    description:
      'A personal project in which I imagined a collaboration between the Swarovski brand and Evian. The collaboration would involve distributing limited edition products from both brands at events such as Roland Garros, Fashion Week, Dubai Week and the Met Gala.',
    image: '/assets/pacome/projects/project-09.avif',
    playbackId: 'qAQWnnz023A00z77cnBAm18r6vyFgkcde9EKurPYVIZAM',
    slug: 'the-purity-revealed',
    title: 'The purity revealed',
    year: 2025,
  },
] as const satisfies readonly TPortfolioProject[]

export const socialLinks = [
  {
    href: 'https://www.instagram.com/',
    icon: 'instagram',
    label: 'Instagram',
  },
  {
    href: 'https://www.x.com/pacomepertant',
    icon: 'x',
    label: 'X / Twitter',
  },
  {
    href: 'https://www.behance.net/pacomepertant',
    icon: 'behance',
    label: 'Behance',
  },
  {
    href: 'https://www.linkedin.com/in/pac%C3%B4me-pertant-b4437126b/',
    icon: 'linkedin',
    label: 'LinkedIn',
  },
] as const satisfies readonly TSocialLink[]

export const portfolioEmail = 'pertantpacome@gmail.com'
export const showreelPlaybackId = 'ycc6bXk6hOWxGnyb6F3wvUxPPLiDML00P9OPkYMjuSN8'
