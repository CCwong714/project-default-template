export const heroCopy = {
  backgroundTitle: 'Meet Elva. A filmmaking crew in your phone.',
  entryTitle:
    'Just shoot. Elva turns your footage into stories you’ll actually want to share.',
} as const

export const cloudStory = {
  kicker: 'Problem Of The Majority',
  backdrop: 'never get seen.',
  title:
    'Every video holds a feeling. But it gets lost in raw clips that never get seen.',
  whatBody: 'No editing tools. No complexity. Just your story.',
  whatKicker: 'What Elva Is',
  whatTitle: 'Your personal AI agent for video',
} as const

export const phoneVideos = {
  intro: '/assets/elva/flow_fixed_m.mp4#t=5.8',
  mainflow: [
    '/assets/elva/mainflow/1_1_m.mp4',
    '/assets/elva/mainflow/1_2_m.mp4',
    '/assets/elva/mainflow/1_3_m.mp4',
    '/assets/elva/mainflow/1_41_m.mp4',
    '/assets/elva/mainflow/1_5_m.mp4',
  ],
} as const

export const phoneMemoryBubbles = [
  {
    image: '/assets/elva/features/0.png',
    size: 36,
    left: 33,
    top: 28,
  },
  {
    image: '/assets/elva/features/1.png',
    size: 42,
    left: 70,
    top: 35,
  },
  {
    image: '/assets/elva/features/2.png',
    size: 18,
    left: 27,
    top: 43,
  },
  {
    image: '/assets/elva/features/3.png',
    size: 45,
    left: 51,
    top: 53,
  },
  {
    image: '/assets/elva/features/4.png',
    size: 30,
    left: 27,
    top: 68,
  },
  {
    image: '/assets/elva/features/1.png',
    size: 42,
    left: 64,
    top: 71,
  },
  {
    image: '/assets/elva/features/2.png',
    size: 30,
    left: 35,
    top: 85,
  },
  {
    image: '/assets/elva/features/3.png',
    size: 18,
    left: 79,
    top: 88,
  },
] as const

export const memoryBubbles = [
  { image: '/assets/elva/features/0.png', size: 66, x: -30, y: -260 },
  { image: '/assets/elva/features/1.png', size: 60, x: 70, y: -238 },
  { image: '/assets/elva/features/4.png', size: 52, x: -170, y: -245 },
  { image: '/assets/elva/features/0.png', size: 44, x: 150, y: -228 },
  { image: '/assets/elva/features/2.png', size: 76, x: -125, y: -185 },
  { image: '/assets/elva/features/3.png', size: 50, x: 14, y: -170 },
  { image: '/assets/elva/features/4.png', size: 70, x: 126, y: -165 },
  { image: '/assets/elva/features/1.png', size: 58, x: -236, y: -175 },
  { image: '/assets/elva/features/2.png', size: 46, x: 210, y: -140 },
  { image: '/assets/elva/features/0.png', size: 46, x: -215, y: -110 },
  { image: '/assets/elva/features/1.png', size: 62, x: -82, y: -92 },
  { image: '/assets/elva/features/2.png', size: 52, x: 52, y: -84 },
  { image: '/assets/elva/features/3.png', size: 68, x: 184, y: -72 },
  { image: '/assets/elva/features/3.png', size: 62, x: -12, y: -122 },
  { image: '/assets/elva/features/4.png', size: 44, x: -12, y: -30 },
  { image: '/assets/elva/features/0.png', size: 56, x: -154, y: 0 },
  { image: '/assets/elva/features/1.png', size: 84, x: 92, y: 8 },
  { image: '/assets/elva/features/2.png', size: 50, x: 226, y: 28 },
  { image: '/assets/elva/features/4.png', size: 48, x: 124, y: -38 },
  { image: '/assets/elva/features/0.png', size: 54, x: -228, y: 32 },
  { image: '/assets/elva/features/3.png', size: 72, x: -46, y: 70 },
  { image: '/assets/elva/features/4.png', size: 54, x: 42, y: 104 },
  { image: '/assets/elva/features/0.png', size: 64, x: -190, y: 120 },
  { image: '/assets/elva/features/1.png', size: 46, x: 162, y: 126 },
  { image: '/assets/elva/features/1.png', size: 44, x: 226, y: 96 },
  { image: '/assets/elva/features/2.png', size: 86, x: -70, y: 180 },
  { image: '/assets/elva/features/3.png', size: 54, x: 72, y: 198 },
  { image: '/assets/elva/features/4.png', size: 68, x: 210, y: 192 },
  { image: '/assets/elva/features/2.png', size: 60, x: -126, y: 142 },
  { image: '/assets/elva/features/3.png', size: 50, x: 18, y: 166 },
  { image: '/assets/elva/features/0.png', size: 48, x: -236, y: 230 },
  { image: '/assets/elva/features/1.png', size: 58, x: 0, y: 260 },
  { image: '/assets/elva/features/2.png', size: 42, x: 136, y: 278 },
  { image: '/assets/elva/features/3.png', size: 76, x: -128, y: 300 },
  { image: '/assets/elva/features/4.png', size: 46, x: 198, y: 248 },
  { image: '/assets/elva/features/0.png', size: 52, x: -12, y: 326 },
] as const

export const storyPanels = [
  {
    className: 'elva-story-panel-what',
    kicker: 'What Elva Is',
    title: 'Your personal AI agent for video',
    body: 'No editing tools. No complexity. Just your story.',
  },
  {
    className: 'elva-story-panel-every',
    kicker: 'Problem Of The Majority',
    title:
      'Every video holds a feeling. But it gets lost in raw clips that never get seen.',
    body: '',
  },
  {
    className: 'elva-story-panel-moments',
    kicker: 'How Elva Fixes It',
    title: 'Elva picks the clips and finds what makes the moment matter',
    body: 'So even everyday footage feels vivid, emotional, and alive',
  },
  {
    className: 'elva-story-panel-easy',
    kicker: "It's easier than you think",
    title: 'You click a button and Elva creates best stories for you',
    body: 'You don’t need to cut clips, adjust timelines, or learn tools.',
  },
  {
    className: 'elva-story-panel-stress',
    kicker: 'Intelligent Camera',
    title: 'Finally, your videos look as good as the moment felt.',
    body: 'Elva guides framing, timing, and capture so every shot looks better.',
  },
] as const

export const flowSteps = [
  {
    kicker: 'Add clips',
    title: 'Start with the videos you already have',
    titleLines: ['Start with the videos', 'you already have'],
    body: 'Elva sorts through everything and builds the foundation for your story.',
  },
  {
    kicker: 'Talk to Elva',
    title: 'Tell Elva what you want — the mood, the pace, the vibe',
    titleLines: ['Tell Elva what you want', 'the mood, the pace, the vibe'],
    body: 'It listens and turns your idea into a finished edit.',
  },
  {
    kicker: 'Music. Captions. Voice.',
    title: 'Elva finishes the edit with music, captions, and voiceover.',
    titleLines: [
      'Elva finishes the edit',
      'with music, captions, and voiceover.',
    ],
    body: 'So every video feels polished, personal, and ready to share.',
  },
  {
    kicker: 'Choose and share',
    title: 'Pick the edit that feels right.',
    titleLines: ['Pick the edit', 'that feels right.'],
    body: 'Choose from a few versions, then save or share in seconds.',
  },
] as const

export const processGallerySprites = [
  {
    columns: 4,
    image: '/assets/elva/gallery/casesprite_003.png',
    rows: 2,
  },
  {
    columns: 4,
    image: '/assets/elva/gallery/casesprite_006.png',
    rows: 2,
  },
] as const

export const processGalleryVideoSprite = {
  columns: 4,
  rows: 2,
  video: '/assets/elva/gallery/casesprite.mp4',
} as const

export const processCameraVideo = '/assets/elva/mainflow/1_5_m.mp4'

export const processFinaleSprite = {
  columns: 8,
  poster: '/assets/elva/sprite_s.png',
  rows: 5,
  video: '/assets/elva/sprite_s.mp4',
} as const

export const uploadClipTiles = [
  {
    image: '/assets/elva/features/0.png',
    duration: '00:05',
    selected: true,
  },
  {
    image: '/assets/elva/features/1.png',
    duration: '00:15',
    selected: false,
  },
  {
    image: '/assets/elva/features/2.png',
    duration: '00:08',
    selected: true,
  },
  {
    image: '/assets/elva/features/3.png',
    duration: '00:05',
    selected: false,
  },
  {
    image: '/assets/elva/features/4.png',
    duration: '00:05',
    selected: true,
  },
  {
    image: '/assets/elva/features/1.png',
    duration: '00:07',
    selected: false,
  },
  {
    image: '/assets/elva/features/3.png',
    duration: '00:06',
    selected: false,
  },
  {
    image: '/assets/elva/features/2.png',
    duration: '00:10',
    selected: false,
  },
  {
    image: '/assets/elva/features/0.png',
    duration: '00:12',
    selected: false,
  },
] as const

export const featureCards = [
  {
    title: 'Pose Mirror',
    bodyLines: [
      'Elva helps you adjust your pose in real time, so you look',
      'more natural and more confident on camera.',
    ],
    image: '/assets/elva/features/0.png',
  },
  {
    title: 'Real-time Guidance',
    bodyLines: [
      'Get live help with framing, horizon, and composition, so',
      'every shot starts stronger.',
    ],
    image: '/assets/elva/features/1.png',
  },
  {
    title: 'Flow Arcs',
    bodyLines: [
      'Flow Arcs guide your camera along natural motion paths —',
      'helping every shot feel smooth, intentional, and cinematic.',
    ],
    image: '/assets/elva/features/2.png',
  },
  {
    title: 'Lighting Spot',
    bodyLines: [
      'Lighting Spot helps you find the best light in the scene —',
      'guiding you toward natural, cinematic lighting in seconds.',
    ],
    image: '/assets/elva/features/3.png',
  },
  {
    title: 'Scene Sense',
    bodyLines: [
      'Scene Sense reads the feeling of the scene and helps you',
      'shoot in a way that matches it.',
    ],
    image: '/assets/elva/features/4.png',
  },
] as const

export const footerLinks = [
  ['General inquiries:', 'hello@elvalabs.ai'],
  ['Partnerships:', 'partners@elvalabs.ai'],
  ['Press:', 'press@elvalabs.ai'],
  ['Careers:', 'hr@elvalabs.ai'],
] as const

export const finaleCopy = {
  title: 'Stop editing. Keep shooting',
  topLeft: [
    'slow moments',
    'unspoken feelings',
    'shared silence',
    'calm movement',
  ],
  topRight: ['fleeting seconds', 'warm evenings', 'almost forgotten'],
  topCenter: [
    ['how it felt', 'before it faded'],
    ['just for a moment', 'exactly like that'],
    ['the feeling stayed', 'still here'],
    ['', 'not lost'],
    ['', 'remembered'],
  ],
  company: ['Company:', 'Elvalabs LTD'],
  address: [
    'Company address:',
    '13 Kypranoros Street, EVI',
    'Building, 2nd Floor,',
    'Office 201, 1061 Nicosia, Cyprus',
  ],
  copyright: [
    ['2026 Ⓒ', 'All rights reserved.'],
    ['design and development', 'Lazarev Agency'],
  ],
  socials: [
    ['IG', 'Instagram', 'https://www.instagram.com/elvalabs.ai'],
    ['TT', 'TikTok', 'https://www.tiktok.com/@elvalabs.ai'],
    ['FB', 'Facebook', 'https://www.facebook.com/elvalabs'],
  ],
  legal: [
    ['ELVA Terms of use', 'terms-of-use.html'],
    ['ELVA Privacy policy', 'privacy-policy.html'],
  ],
} as const
