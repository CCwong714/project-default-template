import type { TPrinciple, TStoryScene } from 'src/features/storytelling/types'

export const storyScenes = [
  {
    id: 'opening',
    kind: 'split',
    start: 0.045,
    end: 0.145,
    lines: [
      [
        { text: 'In a world that’s ' },
        { text: 'constantly shifting,', italic: true },
      ],
      [
        { text: 'what guides us through ' },
        { text: 'change, reinvention,', italic: true },
        { text: ' and the unknown—' },
      ],
    ],
    tone: 'dark',
  },
  {
    id: 'narrative',
    kind: 'editorial',
    start: 0.16,
    end: 0.235,
    lines: [[{ text: 'is ' }, { text: 'narrative.', italic: true }]],
    tone: 'dark',
  },
  {
    id: 'emerge',
    kind: 'editorial',
    start: 0.25,
    end: 0.34,
    lines: [
      [
        { text: 'Stories', italic: true },
        { text: ' emerge' },
        { text: 'through' },
      ],
    ],
    tone: 'dark',
  },
  {
    id: 'senses',
    kind: 'sequence',
    start: 0.345,
    end: 0.49,
    lines: [
      [{ text: 'Light', italic: true }],
      [{ text: 'Spirit', italic: true }],
      [{ text: 'Sound', italic: true }],
    ],
    tone: 'light',
  },
  {
    id: 'invitation',
    kind: 'split',
    start: 0.495,
    end: 0.59,
    lines: [
      [
        { text: 'The best stories don’t just speak to ' },
        { text: 'us.', italic: true },
      ],
      [
        { text: 'They', italic: true },
        { text: ' invite us ' },
        { text: 'inside.', italic: true },
      ],
    ],
    tone: 'light',
  },
  {
    id: 'question',
    kind: 'editorial',
    start: 0.6,
    end: 0.685,
    lines: [
      [{ text: 'How can the story live at the' }],
      [{ text: 'heart', italic: true }, { text: ' of the experience?' }],
    ],
    tone: 'light',
  },
  {
    id: 'experiences',
    kind: 'editorial',
    start: 0.735,
    end: 0.82,
    lines: [
      [{ text: 'Where ' }, { text: 'stories', italic: true }],
      [{ text: 'become experiences' }],
    ],
    tone: 'light',
  },
  {
    id: 'more-than-words',
    kind: 'editorial',
    start: 0.855,
    end: 0.895,
    lines: [[{ text: 'Storytelling is much' }], [{ text: 'more than words.' }]],
    tone: 'light',
  },
  {
    id: 'spark',
    kind: 'editorial',
    start: 0.865,
    end: 0.93,
    lines: [
      [{ text: 'It is how a spark' }],
      [{ text: 'becomes ' }, { text: 'a fire.', italic: true }],
    ],
    tone: 'light',
  },
  {
    id: 'senses-final',
    kind: 'editorial',
    start: 0.915,
    end: 0.965,
    lines: [
      [{ text: 'Storytelling is what you' }],
      [
        { text: 'see, feel, hear, ' },
        { text: 'interact', italic: true },
        { text: ' with.' },
      ],
    ],
    tone: 'ember',
  },
] satisfies readonly TStoryScene[]

export const principles = [
  {
    title: 'Start with clarity',
    titleItalic: 'last',
    body: [
      'Know what you’re trying to say.',
      'Whether it’s launching a product or building emotional connections,',
      'the goal needs to be clear.',
    ],
  },
  {
    title: 'Let the story guide design',
    titleItalic: 'last',
    body: [
      'Every animation, interaction, and visual should serve the narrative.',
      'If it doesn’t help tell the story, it’s not needed.',
    ],
  },
  {
    title: 'Experiment and iterate',
    titleItalic: 'first',
    body: [
      'Some of the best ideas came from simply trying things out,',
      'seeing what clicked, and refining from there.',
    ],
  },
  {
    title: 'Make it personal',
    titleItalic: 'last',
    body: [
      'The best stories create emotional connections.',
      'Whether through AI personalization or custom design elements,',
      'find ways to make the experience unique for each user.',
    ],
  },
] satisfies readonly TPrinciple[]

export const navLinks = [
  { label: 'Agency', href: 'https://noomoagency.com' },
  { label: 'Labs', href: 'https://labs.noomoagency.com' },
  { label: 'Contact', href: 'mailto:hello@noomoagency.com' },
] as const

export const socialLinks = [
  { label: 'x', href: 'https://x.com/noomoagency' },
  { label: 'Instagram', href: 'https://www.instagram.com/noomoagency/' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/noomoagency',
  },
] as const
