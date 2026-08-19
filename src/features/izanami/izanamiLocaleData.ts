import type { TIzanamiProject } from 'src/features/izanami/izanamiData'
import {
  COMPANY_COPY,
  PHILOSOPHY_COPY,
  PROJECTS,
} from 'src/features/izanami/izanamiData'

export type TIzanamiLocale = 'en' | 'ja'

type TLocalizedProjectCopy = Pick<TIzanamiProject, 'description' | 'lead'>

export type TIzanamiCompanyLine = {
  mobileContinuation?: string
  text: string
}

export type TIzanamiPageCopy = {
  companyParagraphs: readonly (readonly TIzanamiCompanyLine[])[]
  metaDescription: string
  philosophyLines: readonly string[]
  projects: readonly TIzanamiProject[]
  projectsIntroLines: readonly string[]
}

const JAPANESE_PROJECT_COPY: Record<
  TIzanamiProject['title'],
  TLocalizedProjectCopy
> = {
  Craft: {
    description:
      '日本の美意識を現代のラグジュアリーへと翻訳し、唯一無二のプロダクトや空間をデザイン。ドバイを中心に、和の精神による上質な暮らしを提供しています。',
    lead: '日本の美意識で、感覚を呼び戻す。',
  },
  Retreat: {
    description:
      '古代マヤ文明から受け継がれる植物療法で、本来の感覚や在り方を思い出す為のプライベートセレモニーを実施。Izanami創設者のMocaが世界各地で開催しています。',
    lead: '自らの本質へ、還る。',
  },
  School: {
    description:
      '「0歳からのママスクール®」というブランドで日本全国2万人以上の親子をサポート。親と子どもの「願い」が叶う場所として数々の喜びの声が届いています。',
    lead: '命の土台を、豊かに育む。',
  },
}

const JAPANESE_PROJECTS = PROJECTS.map((project) => ({
  ...project,
  ...JAPANESE_PROJECT_COPY[project.title],
}))

export const IZANAMI_COPY_BY_LOCALE = {
  en: {
    companyParagraphs: [
      [{ text: COMPANY_COPY[0] }],
      [{ text: COMPANY_COPY[1] }],
    ],
    metaDescription:
      'Harmony is not something to be created — it is something to be remembered. Guided by the spirit of Wa, Izanami designs harmony across life through School, Craft, and Retreat.',
    philosophyLines: [PHILOSOPHY_COPY],
    projects: PROJECTS,
    projectsIntroLines: [
      'Through three practices,',
      'Izanami designs harmony across life.',
      'How life is nurtured, how living is enriched,',
      'and how one returns to oneself.',
    ],
  },
  ja: {
    companyParagraphs: [
      [
        { text: '時代がどれほど移り変わろうとも、' },
        {
          mobileContinuation: '変わることはありません。',
          text: '人間にとっての本質的な豊かさが',
        },
      ],
      [
        { text: '私たちは日本やドバイをはじめとする世界各地で、' },
        { text: '命の土台を育む「人間教育」、' },
        { text: '暮らしの質を高める「伝統工芸」、' },
        { text: '本来の自分に還る「植物療法」をデザインします。' },
      ],
      [
        { text: '文化や常識の壁を超えて。' },
        { text: '人々の内なる個性が輝き、地球と調和し生きるための、' },
        { text: '新しくも普遍的な「在り方」を世界へ広げます。' },
      ],
    ],
    metaDescription:
      '日本の美意識と和の精神を、世界へ。Izanamiは、School・Craft・Retreatの3つの事業を通して、人生における調和をデザインします。',
    philosophyLines: [
      '調和とは「作り出すもの」ではなく「思い出すもの」。',
      'Izanamiは日本に受け継がれる和の精神を通して、',
      '本来の在り方を思い出し、自分と調和し、',
      '世界と調和する豊かな生き方の指針を届けていきます。',
    ],
    projects: JAPANESE_PROJECTS,
    projectsIntroLines: [
      'Izanamiは、3つの事業を通して、',
      '人生における調和をデザインします。',
      'いかに命を育み、暮らしを輝かせ、',
      'そして自分を思い出すか。',
    ],
  },
} as const satisfies Record<TIzanamiLocale, TIzanamiPageCopy>

export function getIzanamiLocale(pathname: string): TIzanamiLocale {
  if (pathname === '/ja' || pathname.startsWith('/ja/')) {
    return 'ja'
  }
  return 'en'
}
