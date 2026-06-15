export const pageNav = [
  ["01", "Overview", "#overview"],
  ["02", "Key features", "#key-features"],
  ["03", "Sample projects", "#sample-projects"],
  ["04", "Get started", "#get-started"],
  ["05", "Resources", "#resources"],
] as const;

export const epicLinks = [
  ["Epic Games", "https://www.epicgames.com/site/home"],
  ["Fortnite", "https://www.fortnite.com/"],
  ["Unreal Engine", "https://www.unrealengine.com/"],
  ["MetaHuman", "https://www.metahuman.com/"],
  ["Fab", "https://www.fab.com/"],
  ["Sketchfab", "https://sketchfab.com/"],
  ["ArtStation", "https://www.artstation.com/"],
] as const;

export const headerMenus = [
  {
    label: "Overview",
    href: "https://www.unrealengine.com/",
    columns: [
      {
        links: [
          ["Unreal Engine", "https://www.unrealengine.com/"],
          ["Features", "https://www.unrealengine.com/features"],
          ["Licensing", "https://www.unrealengine.com/license"],
          ["FAQ", "https://www.unrealengine.com/faq"],
        ],
      },
    ],
  },
  {
    label: "Uses",
    href: "https://www.unrealengine.com/uses/switching-to-unreal-engine",
    columns: [
      {
        links: [
          [
            "Switching to Unreal Engine",
            "https://www.unrealengine.com/uses/switching-to-unreal-engine",
          ],
          ["AAA games", "https://www.unrealengine.com/uses/games"],
          ["Indie games", "https://www.unrealengine.com/uses/indie-games"],
          ["Mobile games", "https://www.unrealengine.com/uses/mobile-games"],
          ["Unreal Editor for Fortnite", "https://www.fortnite.com/developer"],
          ["Film & TV", "https://www.unrealengine.com/uses/film-television"],
          [
            "Broadcast & live events",
            "https://www.unrealengine.com/uses/broadcast-live-events",
          ],
          ["Animation", "https://www.unrealengine.com/uses/animation"],
          ["Architecture", "https://www.unrealengine.com/uses/architecture"],
          ["Automotive", "https://www.unrealengine.com/uses/automotive"],
          ["Simulation", "https://www.unrealengine.com/uses/simulation"],
          ["HMI", "https://www.unrealengine.com/uses/hmi"],
          ["Digital Twins", "https://www.unrealengine.com/digital-twins"],
        ],
      },
    ],
  },
  {
    label: "News",
    href: "https://www.unrealengine.com/feed",
    columns: [],
  },
  {
    label: "Forums",
    href: "https://forums.unrealengine.com/categories?tag=unreal-engine",
    columns: [],
  },
  {
    label: "Documentation",
    href: "https://dev.epicgames.com/documentation/unreal-engine",
    columns: [],
  },
  {
    label: "Learning",
    href: "https://dev.epicgames.com/community/unreal-engine/learning",
    columns: [
      {
        links: [
          [
            "Learning library",
            "https://dev.epicgames.com/community/unreal-engine/learning",
          ],
          [
            "Getting started",
            "https://dev.epicgames.com/community/unreal-engine/getting-started/games",
          ],
          [
            "Snippets repository",
            "https://dev.epicgames.com/community/unreal-engine/snippets",
          ],
        ],
      },
    ],
  },
  {
    label: "Connect",
    href: "https://www.unrealengine.com/events",
    columns: [
      {
        links: [
          ["Unreal Fest", "https://www.unrealengine.com/unreal-fest"],
          ["Events", "https://www.unrealengine.com/events"],
          ["Megagrants", "https://www.unrealengine.com/megagrants"],
          ["Meetups", "https://communities.unrealengine.com/"],
          [
            "Service partners",
            "https://www.unrealengine.com/service-partner-program",
          ],
          [
            "Students and schools",
            "https://www.unrealengine.com/students-and-schools",
          ],
          [
            "Training & academic partners",
            "https://www.unrealengine.com/training-academic-partners",
          ],
          ["Research", "https://www.unrealengine.com/research"],
        ],
      },
    ],
  },
  {
    label: "Fab",
    href: "https://www.fab.com/channels/unreal-engine",
    columns: [],
  },
] as const;

export const languageLinks = [
  ["Deutsch", "?lang=de"],
  ["English", "?lang=en-US"],
  ["Español", "?lang=es-ES"],
  ["Français", "?lang=fr"],
  ["Português (Brasil)", "?lang=pt-BR"],
  ["日本語", "?lang=ja"],
  ["简体中文", "?lang=zh-CN"],
  ["한국어", "?lang=ko"],
] as const;

export const industryLinks = [
  "Games",
  "Film & television",
  "Architecture",
  "Automotive & transportation",
  "Broadcast & live events",
  "Simulation",
  "More",
];

export const overviewItems = [
  {
    title: "Build bigger worlds",
    image: "/assets/ue5/bigger-worlds.jpg",
    copy: "Create expansive spaces with streaming, collaborative world-building workflows, and production-ready open-world tools.",
  },
  {
    title: "Leverage game-changing fidelity",
    image: "/assets/ue5/game-changing-fidelity.jpg",
    copy: "Bring film-quality geometry and dynamic lighting into real-time experiences without waiting on long bake cycles.",
  },
  {
    title: "Animate and model in context",
    image: "/assets/ue5/animated-context.jpg",
    copy: "Rig, animate, retarget, model, and iterate inside the editor so creative decisions stay close to the final scene.",
  },
];

export const featureItems = [
  {
    label: "Nanite",
    title: "Massively detailed worlds",
    image: "/assets/ue5/nanite-wire.jpg",
    copy: "Virtualized geometry lets dense assets render efficiently while preserving close-up detail across large scenes.",
  },
  {
    label: "Lumen",
    title: "Dynamic global illumination and reflections",
    image: "/assets/ue5/lumen-room.jpg",
    copy: "Lighting responds to time of day, moving objects, emissive surfaces, and cinematic changes with immediate feedback.",
  },
  {
    label: "Temporal Super Resolution",
    title: "Quality or performance? Why choose?",
    image: "/assets/ue5/temporal-super-resolution.jpg",
    copy: "High-quality upsampling helps deliver crisp images and smooth frame rates for demanding next-generation scenes.",
  },
  {
    label: "World Partition",
    title: "Bigger, better Open Worlds",
    image: "/assets/ue5/world-partition.jpg",
    copy: "Automatic grid streaming, data layers, and actor-based collaboration make large worlds easier to build and maintain.",
  },
  {
    label: "Animation",
    title: "Animation in context",
    image: "/assets/ue5/animation-context.jpg",
    copy: "Author performances, iterate cameras, retarget characters, and polish motion directly where the action happens.",
  },
  {
    label: "Modeling",
    title: "Asset development on the spot",
    image: "/assets/ue5/modeling.jpg",
    copy: "Use in-editor modeling and UV tools for quick fixes, blockouts, and production adjustments without leaving the scene.",
  },
  {
    label: "Audio",
    title: "Procedural audio design",
    image: "/assets/ue5/audio.jpg",
    copy: "Build expressive audio systems that react to gameplay and environments using modern procedural sound workflows.",
  },
];

export const samples = [
  {
    title: "Stack O Bot",
    image: "/assets/ue5/stack-o-bot.png",
    copy: "A practical sandbox project that introduces UE5 features through a compact, developer-friendly vertical slice.",
  },
  {
    title: "Lyra Starter Game",
    image: "/assets/ue5/lyra.jpg",
    copy: "A modular gameplay project designed as a living example of current Unreal Engine production patterns.",
  },
  {
    title: "City Sample",
    image: "/assets/ue5/city-sample.jpg",
    copy: "A large city scene demonstrating crowds, vehicles, lighting, streaming, buildings, and cinematic scale.",
  },
];

export const learning = [
  {
    title: "Unreal Engine 5 Guided Tour",
    duration: "37 mins",
    image: "/assets/ue5/guided-tour.png",
    copy: "Build a small scene from scratch and see how the UE5 toolset fits together.",
  },
  {
    title: "Your First Hour in Unreal Engine 5.2",
    duration: "51 mins",
    image: "/assets/ue5/first-hour.jpg",
    copy: "A first-session walkthrough for editor basics, assets, lighting, Blueprints, and sharing a project.",
  },
];
