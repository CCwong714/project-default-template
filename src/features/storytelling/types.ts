export type TStorySceneKind = 'split' | 'editorial' | 'sequence'

export type TCopySegment = {
  text: string
  italic?: boolean
}

export type TCopyLine = readonly TCopySegment[]

export type TStoryScene = {
  id: string
  kind: TStorySceneKind
  start: number
  end: number
  lines: readonly TCopyLine[]
  tone: 'dark' | 'light' | 'ember'
}

export type TPrinciple = {
  title: string
  titleItalic?: 'first' | 'last'
  body: readonly string[]
}

export type TProgressSource = {
  getCurrent: () => number
  getTarget: () => number
  subscribe: (listener: (progress: number) => void) => () => void
}
