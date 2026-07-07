export const homeLinks = {
  epicGames: "https://www.epicgames.com/site/home",
  download: "https://www.unrealengine.com/download",
  features: "https://www.unrealengine.com/features",
  whatsNew: "https://www.unrealengine.com/whats-new",
  licensing: "https://www.unrealengine.com/license",
  documentation: "https://dev.epicgames.com/documentation/unreal-engine",
  support: "https://www.unrealengine.com/support",
  learning: "https://dev.epicgames.com/community/learning?application=unreal_engine",
  community: "https://dev.epicgames.com/community/unreal-engine",
  fab: "https://www.fab.com/channels/unreal-engine",
  uefn: "https://www.fortnite.com/developer",
  uefnGettingStarted: "https://dev.epicgames.com/community/fortnite/new-to",
  metahuman: "https://www.metahuman.com/",
  megascans: "https://www.fab.com/sellers/Quixel%20Megascans",
  store: "https://store.epicgames.com/",
} as const;

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
          ["Features", homeLinks.features],
          ["Licensing", homeLinks.licensing],
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
          ["Unreal Editor for Fortnite", homeLinks.uefn],
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
    href: homeLinks.documentation,
    columns: [],
  },
  {
    label: "Learning",
    href: homeLinks.learning,
    columns: [
      {
        links: [
          ["Learning library", homeLinks.learning],
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
    href: homeLinks.fab,
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
  ["Games", "https://www.unrealengine.com/uses/games"],
  ["Film & television", "https://www.unrealengine.com/uses/film-television"],
  ["Architecture", "https://www.unrealengine.com/uses/architecture"],
  [
    "Automotive & transportation",
    "https://www.unrealengine.com/uses/automotive",
  ],
  [
    "Broadcast & live events",
    "https://www.unrealengine.com/uses/broadcast-live-events",
  ],
  ["Simulation", "https://www.unrealengine.com/uses/simulation"],
  ["More", "https://www.unrealengine.com/uses"],
] as const;

export const overviewItems = [
  {
    title: "Build bigger worlds",
    image: "/assets/ue5/game-changing-fidelity.jpg",
    copy: "Think big, really big. Unreal Engine 5 provides the tools and assets you need to create truly expansive worlds for your players, participants, and stakeholders to explore, using content that scales.",
  },
  {
    title: "Leverage game-changing fidelity",
    image: "/assets/ue5/bigger-worlds.jpg",
    copy: "Bring incredibly immersive and realistic interactive experiences to life with groundbreaking features like Nanite and Lumen that provide a generational leap in visual fidelity, and enable worlds to be fully dynamic.",
  },
  {
    title: "Animate and model in context",
    image: "/assets/ue5/animated-context.jpg",
    copy: "Artist-friendly animation authoring, rigging, retargeting, and runtime tools—together with a continually expanding modeling toolset—reduce iteration and eliminate round-tripping, speeding up the creative process.",
  },
] as const;

export const uefnActions = [
  ["Learn more", homeLinks.uefn],
  ["Dive in", homeLinks.uefnGettingStarted],
] as const;

export const featureActions = [
  ["See all features", homeLinks.features],
  ["See what’s new", homeLinks.whatsNew],
] as const;

export const featureItems = [
  {
    label: "Nanite & Virtual Shadow Maps",
    title: "Massively detailed worlds",
    images: ["/assets/ue5/nanite-wire.jpg", "/assets/ue5/nanite-rooftop.jpg"],
    copy: [
      "Bring in dense meshes and detailed environments while keeping scenes practical for real-time play and iteration.",
      "Virtualized geometry and shadowing focus work on visible detail, easing traditional limits around polygons and draw calls.",
    ],
  },
  {
    label: "Lumen",
    title: "Dynamic global illumination and reflections",
    images: ["/assets/ue5/lumen-room.jpg"],
    copy: [
      "Lighting and reflections respond to moving objects, changing time of day, emissive surfaces, and edited geometry.",
      "The editor preview stays close to the final result, so teams spend less time baking and more time shaping scenes.",
    ],
  },
  {
    label: "Temporal Super Resolution",
    title: "Quality or performance? Why choose?",
    images: ["/assets/ue5/temporal-super-resolution.jpg"],
    copy: [
      "High-quality upsampling helps demanding projects target smooth frame rates without giving up crisp final pixels.",
      "It is designed for modern platform expectations where higher resolution and 60 fps targets compete for render budget.",
    ],
  },
  {
    label: "World Partition",
    title: "Bigger, better Open Worlds",
    images: ["/assets/ue5/world-partition.jpg"],
    copy: [
      "Large maps can be divided into streamed grid cells so only the necessary parts of the world are loaded.",
      "Data Layers and actor-based collaboration support teams working together on alternate versions of the same world.",
    ],
  },
  {
    label: "Characters & animation",
    title: "Animation in context",
    images: ["/assets/ue5/animation-context.jpg"],
    copy: [
      "Built-in authoring tools help teams animate, pose, retarget, and iterate with less dependence on external DCC handoffs.",
      "Runtime systems can adjust motion for speed, terrain, and gameplay changes while preserving believable performances.",
    ],
  },
  {
    label: "Modeling",
    title: "Asset development on the spot",
    images: ["/assets/ue5/modeling.jpg"],
    copy: [
      "Use mesh editing, UV, geometry scripting, baking, and attribute tools inside Unreal Editor for rapid asset changes.",
      "Artists can block out, fix, and polish dense production assets in context, which lowers friction during reviews.",
    ],
  },
  {
    label: "MetaSounds",
    title: "Procedural audio design",
    images: ["/assets/ue5/audio.jpg"],
    copy: [
      "Create programmable audio systems that react to gameplay, parameters, and environments through a node-based graph.",
      "The workflow brings a material-editor feel to sound design, giving teams precise control over procedural playback.",
    ],
  },
] as const;

export const samples = [
  {
    title: "Stack O Bot",
    image: "/assets/ue5/stack-o-bot.png",
    href: homeLinks.fab,
    copy: [
      {
        text: "Stack O Bot is a small sandbox project that shows all the new features of Unreal Engine 5 in a practical vertical slice. Paired with our ",
      },
      {
        href: homeLinks.learning,
        text: "learning path content",
      },
      {
        text: " that guides you through each facet of the project, this demo has everything a new developer needs to get started, while also providing a handy toolbox for more experienced indies to sink their teeth into.",
      },
    ],
  },
  {
    title: "Lyra Starter Game",
    image: "/assets/ue5/lyra.jpg",
    href: homeLinks.fab,
    copy: [
      {
        text: "Lyra Starter Game is a sample gameplay project built alongside Unreal Engine 5 development to serve as an excellent starting point for creating new games for more advanced developers, as well as a hands-on learning resource. We plan to continue to upgrade this living project with future releases to demonstrate our latest best practices.",
      },
    ],
  },
  {
    title: "City Sample",
    image: "/assets/ue5/city-sample.jpg",
    href: homeLinks.fab,
    copy: [
      {
        text: "The City Sample is a free downloadable sample project that reveals how the city scene from ",
      },
      {
        href: homeLinks.fab,
        text: "The Matrix Awakens: An Unreal Engine 5 Experience",
      },
      {
        text: " was built. The project--which consists of a complete city with buildings, vehicles, and crowds of MetaHuman characters--demonstrates how we used new and improved systems in Unreal Engine 5 to create the experience.",
      },
    ],
  },
] as const;

export const licenseCards = [
  {
    label: "Download for free",
    title: "Under $1M USD?",
    href: homeLinks.download,
    copy: "UE5 is free for linear content, custom/internal projects, and game development until gross product revenue passes the $1M USD threshold.",
  },
  {
    label: "Find out more",
    title: "Other licensing options",
    href: homeLinks.licensing,
    copy: "Teams above that threshold, or teams that need premium support, training, or custom terms, can review the available licensing paths.",
  },
] as const;

export const resourceCards = [
  {
    label: "documentation",
    title: "Information at your fingertips",
    href: homeLinks.documentation,
    copy: "Access comprehensive documentation for everything that’s new in Unreal Engine 5.",
  },
  {
    label: "support",
    title: "Need a hand?",
    href: homeLinks.support,
    copy: "Explore options for both free community support and premium support with dedicated Epic staff.",
  },
] as const;

export const learning = [
  {
    title: "Unreal Engine 5 Guided Tour",
    duration: "37 Mins",
    image:
      "https://cdn2.unrealengine.com/unreal-engine-5-guided-tour-1920x1080-118361cb93a9.png?resize=1&w=1920",
    href: "https://dev.epicgames.com/community/learning/talks-and-demos/vyn9/unreal-engine-5-guided-tour",
    copy: "Haven't yet taken the plunge into UE5 and want to see some of what you're missing? In this video, we'll build a small scene from nothing, covering how the toolset fundamentals work together and sharing some useful tips and tricks along the way.",
  },
  {
    title: "Your First Hour in Unreal Engine 5.2",
    duration: "51 mins",
    image:
      "https://cdn2.unrealengine.com/your-first-hour-with-unreal-engine-5-2-1920x1080-2248ed6841b8.jpg?resize=1&w=1920",
    href: "https://dev.epicgames.com/community/learning/courses/3ke/your-first-hour-in-unreal-engine-5-2/vvdk/your-first-hour-in-unreal-engine-5-2-overview",
    copy: "This course will introduce you to the high-level basics of Unreal Engine 5.2 and the editor used to work within it. We’ll look at how to add assets, create lighting, make Blueprints, and even share your project.",
  },
] as const;

export const communityCallout = {
  label: "Epic Developer Community",
  title: "Learn, discuss, share",
  href: homeLinks.community,
  image: "/assets/ue5/dev-community.jpg",
  copy: "Join our vibrant, friendly community of creators to ask and answer questions on the forums; show off your work and get inspiration from others; and access hundreds of hours of free online learning content.",
} as const;

export const productItems = [
  {
    label: "MetaHuman",
    title: "High-fidelity digital humans made easy",
    href: homeLinks.metahuman,
    action: "Learn more",
    image:
      "https://cdn2.unrealengine.com/body4-hair-and-fur-white-paper-1920x1080-5780d31cc71b.jpg?resize=1&w=776",
    icon: "https://cdn2.unrealengine.com/icon-metahuman-6bbfab02073f.svg?resize=1&w=1920",
    copy: "MetaHuman is a comprehensive real-time framework that enables you to design, animate, and deploy realistic or stylized digital humans across any workflow.",
  },
  {
    label: "Quixel Megascans",
    title: "The world’s largest photogrammetry asset library at your fingertips",
    href: homeLinks.megascans,
    action: "Browse now",
    image:
      "https://cdn2.unrealengine.com/game-changing-1920x1080-d8ee0c5b386d.jpg?resize=1&w=776",
    icon: "https://cdn2.unrealengine.com/quixel-icon-white-18a67f3097d1-c34c181489db.svg?resize=1&w=1920",
    copy: "Create lifelike scenes and high-quality content with Quixel’s tens of thousands of premium-quality 3D and 2D PBR assets.",
  },
] as const;

export const footerSocialLinks = [
  ["X", "https://twitter.com/UnrealEngine"],
  ["Facebook", "https://www.facebook.com/UnrealEngine/"],
  ["Twitch", "https://www.twitch.tv/unrealengine"],
  ["Instagram", "https://www.instagram.com/unrealengine/"],
  ["YouTube", "https://www.youtube.com/user/UnrealDevelopmentKit"],
  ["RSS", "https://www.unrealengine.com/rss"],
] as const;

export const footerColumns = [
  {
    title: "Games",
    links: [
      ["Fortnite", "https://www.fortnite.com/"],
      ["Fall Guys", "https://www.fallguys.com/"],
      ["Rocket League", "https://www.rocketleague.com/"],
      ["Unreal Tournament", "https://www.epicgames.com/unrealtournament/"],
      ["Infinity Blade", "https://www.epicgames.com/site/infinity-blade"],
      ["Shadow Complex", "https://www.epicgames.com/shadowcomplex/"],
      ["Robo Recall", "https://www.epicgames.com/roborecall/"],
    ],
  },
  {
    title: "Marketplaces",
    links: [
      ["Epic Games Store", homeLinks.store],
      ["Fab", "https://www.fab.com/"],
      ["Quixel Megascans on Fab", homeLinks.megascans],
      ["Quixel Megaplants on Fab", "https://www.fab.com/sellers/Quixel"],
      ["Sketchfab", "https://sketchfab.com/"],
      ["ArtStation", "https://www.artstation.com/"],
      ["Store Refund Policy", "https://store.epicgames.com/refund-policy"],
      ["Store EULA", "https://www.epicgames.com/site/store-eula"],
    ],
  },
  {
    title: "Tools",
    links: [
      ["Unreal Engine", "https://www.unrealengine.com/"],
      ["UEFN", homeLinks.uefn],
      ["MetaHuman", homeLinks.metahuman],
      ["Twinmotion", "https://www.twinmotion.com/"],
      ["RealityScan", "https://www.unrealengine.com/realityscan"],
      ["RAD Game Tools", "https://www.radgametools.com/"],
    ],
  },
  {
    title: "Online Services",
    links: [
      ["Epic Online Services", "https://dev.epicgames.com/services"],
      [
        "Kids Web Services",
        "https://dev.epicgames.com/docs/kids-web-services",
      ],
      ["Services Agreement", "https://www.epicgames.com/site/services-agreement"],
      [
        "Acceptable Use Policy",
        "https://www.epicgames.com/site/acceptable-use-policy",
      ],
      ["Trust Statement", "https://www.epicgames.com/site/trust-statement"],
      [
        "Subprocessor List",
        "https://www.epicgames.com/site/subprocessor-list",
      ],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "https://www.epicgames.com/site/en-US/about"],
      ["Newsroom", "https://www.epicgames.com/site/en-US/newsroom"],
      ["Careers", "https://www.epicgames.com/site/en-US/careers"],
      ["Students", "https://www.epicgames.com/site/en-US/students"],
      ["UX Research", "https://www.epicgames.com/site/ux"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Dev Community", homeLinks.community],
      ["MegaGrants", "https://www.unrealengine.com/megagrants"],
      ["Support-A-Creator", "https://sac.epicgames.com/"],
      ["Creator Agreement", "https://www.epicgames.com/site/creator-agreement"],
      ["Distribute on Epic Games", "https://store.epicgames.com/distribution"],
      [
        "Unreal Engine Branding Guidelines",
        "https://www.unrealengine.com/branding",
      ],
      ["Fan Art Policy", "https://www.epicgames.com/site/fan-art-policy"],
      ["Community Rules", "https://www.epicgames.com/site/community-rules"],
      [
        "EU Digital Services Act Inquiries",
        "https://www.epicgames.com/site/digital-services-act",
      ],
      ["Epic Pro Support", "https://www.unrealengine.com/support"],
    ],
  },
] as const;

export const footerLegalLinks = [
  ["Terms of service", "https://www.epicgames.com/site/en-US/tos"],
  ["Privacy policy", "https://www.epicgames.com/site/en-US/privacypolicy"],
  ["Safety & security", "https://www.epicgames.com/site/security"],
] as const;

export const footerCopyright =
  "© 2026 Epic Games, Inc. All rights reserved. Unreal and its logo are Epic’s trademarks or registered trademarks in the US and elsewhere.";
