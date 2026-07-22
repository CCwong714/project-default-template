export const industryFilters = [
  "All Industries",
  "Consulting",
  "Culture",
  "Fashion & Beauty",
  "Hospitality",
  "Impact",
  "Tech",
  "Travel",
  "Other",
] as const;

export type IndustryFilter = (typeof industryFilters)[number];

type ClientMedia =
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "video";
      src: string;
      alt: string;
      poster: string;
    };

export type Client = {
  id: string;
  name: string;
  label: string;
  description: string;
  media: ClientMedia;
  logo: string;
};

export const clients = [
  {
    "id": "rpa",
    "name": "RPA 🎤",
    "label": "COCOTA® x RPA",
    "description": "We partnered with RPA, a leader events agency in Spain, on a four-month rebranding process. Through in-depth research into their content, client and team interviews, and team dynamics, we defined a renewed brand strategy and developed a brand new visual identity.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-01-rpa.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-01-rpa.svg"
  },
  {
    "id": "wild",
    "name": "WILD 🫧",
    "label": "COCOTA® x WILD",
    "description": "This British beauty startup hired us as their brand agency to build their brand. After the initial brand definition, we support its activation through product, packaging, stand design, and brand guardianship.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-02-wild.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-02-wild.svg"
  },
  {
    "id": "fiet",
    "name": "FIET 🕊️",
    "label": "COCOTA® x FIET",
    "description": "We supported the NGO Fiet in designing their new website. The main challenge was to clearly communicate their value proposition, reflect the essence of their brand, and make donations easy.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-03-fiet.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-03-fiet.svg"
  },
  {
    "id": "room-mate",
    "name": "ROOM MATE HOTELS 🏨",
    "label": "COCOTA® x ROOM MATE",
    "description": "After Room Mate Hotels’ rebrand, we partnered with them to design their external signage and create a detailed playbook to activate signage and wayfinding across all their hotels.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-04-room-mate.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-04-room-mate.svg"
  },
  {
    "id": "madrid-beyond",
    "name": "MADRID AND BEYOND 💃",
    "label": "COCOTA® x MADRID&BEYOND",
    "description": "We were hired by this luxury travel company as a graphic design studio to redesign their brand identity and corporate website. We focused on the website’s interaction design to translate the luxury experience into the digital space.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-05-madrid-beyond.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-05-madrid-beyond.svg"
  },
  {
    "id": "amadeus",
    "name": "AMADEUS ✈️",
    "label": "COCOTA® x AMADEUS",
    "description": "We have worked with Amadeus on their annual global report for multiple years, fostering a strong creative partnership that has lasted over a decade.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-06-amadeus.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-06-amadeus.svg"
  },
  {
    "id": "avolta",
    "name": "AVOLTA 🎁",
    "label": "COCOTA® x AVOLTA",
    "description": "From internal communication campaigns to gifts, we help Avolta elevate their brand through creative consulting and design services.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-07-avolta.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-07-avolta.svg"
  },
  {
    "id": "havaianas",
    "name": "HAVAIANAS 🩴",
    "label": "COCOTA® x HAVAIANAS",
    "description": "Since 2017, our retail and campaign designs have helped bring Havaianas' vision to life in their EMEA stores, improving brand visibility and reinforcing customer loyalty.",
    "media": {
      "type": "video",
      "src": "/assets/cocota/clients/client-08-havaianas.mp4",
      "alt": "Creative design agency",
      "poster": "/assets/cocota/clients/client-video-poster.webp"
    },
    "logo": "/assets/cocota/clients/client-08-havaianas.svg"
  },
  {
    "id": "loewe",
    "name": "LOEWE 👜",
    "label": "COCOTA® x LOEWE",
    "description": "With our gift and packaging designs, we captured the essence of Loewe's values, making a significant brand statement at various events.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-09-loewe.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-09-loewe.svg"
  },
  {
    "id": "sedra",
    "name": "SEDRA 🌈",
    "label": "COCOTA® x SEDRA",
    "description": "From 2023 onward, we have been working closely as graphic design studio with SEDRA, a non-governmental organization dedicated to sexual health education. Digital platforms and editorial design have been the core focus of our collaboration.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-10-sedra.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-10-sedra.svg"
  },
  {
    "id": "el-corte-ingles",
    "name": "EL CORTE INGLÉS SEGUROS",
    "label": "COCOTA® x EL CORTE INGLÉS",
    "description": "During our three-year partnership, we were the creative agency in charge of the company’s paid media visual strategy, and generated creative concepts and visual content for all their paid media channels every month.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-11-el-corte-ingles.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-11-el-corte-ingles.svg"
  },
  {
    "id": "faster-displays",
    "name": "FASTER DISPLAYS",
    "label": "COCOTA® x FASTER",
    "description": "Our corporate website design elevated Faster Displays products from cardboard to technology, effectively communicating its value proposition through 3D visuals and \"scrollytelling\".",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-12-faster-displays.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-12-faster-displays.svg"
  },
  {
    "id": "ahec",
    "name": "AHEC 🪵",
    "label": "COCOTA® x AHEC",
    "description": "Inspired by the theme of Nature Connections, we created a visual ecosystem for the American Hardwood Export Council exhibition at the Madrid Design Festival. This involved designing the visual identity, signage, and digital communication materials.",
    "media": {
      "type": "video",
      "src": "/assets/cocota/clients/client-13-ahec.mp4",
      "alt": "Creative design agency",
      "poster": "/assets/cocota/clients/client-video-poster.webp"
    },
    "logo": "/assets/cocota/clients/client-13-ahec.svg"
  },
  {
    "id": "juventud-madrid",
    "name": "JUVENTUD MADRID",
    "label": "COCOTA® x JUVENTUD",
    "description": "We assisted the Youth Department of the Community of Madrid in aligning their brand with their target audience by updating the visual identity and developing a standardized set of post templates for their primary social media platform.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-14-juventud-madrid.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-14-juventud-madrid.svg"
  },
  {
    "id": "valora",
    "name": "VALORA 🌿",
    "label": "COCOTA® x VALORA",
    "description": "Ongoing collaboration with Valora, a leading ESG consulting firm, focuses on digital projects to assist their clients in decision-making processes. At the core of these projects is product design, including the development of a Minimum Viable Product (MVP).",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-15-valora.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-15-valora.svg"
  },
  {
    "id": "crusto",
    "name": "CRUSTÓ 🥐",
    "label": "COCOTA® x CRUSTÓ",
    "description": "Our close collaboration with Crustó as brand consultancy and graphic design studio helped the bakery channel their artisanal spirit, while also repositioning the brand with a cosmopolitan twist. We redesigned their identity for an elevated customer experience, launching it through a series of rollout campaigns.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-16-crusto.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-16-crusto.svg"
  },
  {
    "id": "rubicom",
    "name": "RUBICOM",
    "label": "COCOTA® x RUBICOM",
    "description": "Rubicom, a new Swiss PR company, chose Cocota's brand consulting expertise and graphic design services to create a brand strategy, visual identity, brand rollout, and website that embody the narrative behind its name.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-17-rubicom.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-17-rubicom.svg"
  },
  {
    "id": "museo-del-traje",
    "name": "MUSEO DEL TRAJE 👘",
    "label": "COCOTA® x MUSEO DEL TRAJE",
    "description": "Since the beginning of Cocota, we have partnered extensively with the Fashion and Textile Museum, creating its signage, as well as visual identities and rollout materials for various exhibitions.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-18-museo-del-traje.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-18-museo-del-traje.svg"
  },
  {
    "id": "quintussa",
    "name": "QUINTUSSA 💎",
    "label": "COCOTA x QUINTUSSA",
    "description": "For Quintussa, a sustainable fashion platform featuring carefully curated items from Spanish brands, we designed a polished visual identity and a user-friendly website that allows their customers to effortlessly create their own outfits.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-19-quintussa.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-19-quintussa.svg"
  },
  {
    "id": "kinepolis",
    "name": "KINÉPOLIS 🎬",
    "label": "COCOTA® x KINEPOLIS",
    "description": "For over a decade, we have crafted brand and promotional campaigns for Kinepolis on both national and international levels. Managing them from start to finish, we've handled everything from creative ideas to videos, radio spots, photo shoots, and environmental designs.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-20-kinepolis.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-20-kinepolis.svg"
  },
  {
    "id": "pichiavo",
    "name": "PICHIAVO 🎨",
    "label": "COCOTA® x PICHIAVO",
    "description": "For this duo of Valencian artists, we created a portfolio website that showcases their distinctive fusion of Greco-Roman and urban art. The thoughtful user experience, user interface, and interaction designs bring the concept of intervention to the digital realm.",
    "media": {
      "type": "video",
      "src": "/assets/cocota/clients/client-21-pichiavo.mp4",
      "alt": "Creative design agency",
      "poster": "/assets/cocota/clients/client-video-poster.webp"
    },
    "logo": "/assets/cocota/clients/client-21-pichiavo.svg"
  },
  {
    "id": "sincro",
    "name": "SINCRO",
    "label": "COCOTA® x SINCRO",
    "description": "For Sincro, a growing consulting firm, we delved into the storytelling behind its name and into it's team culture to design a comprehensive brand architecture and rollout. Influenced by the Basque traineras legacy, we crafted their verbal and visual identity, including the signage for their new office.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-22-sincro.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-22-sincro.svg"
  },
  {
    "id": "gloss-raffles",
    "name": "GLOSS & RAFFLES",
    "label": "COCOTA® x GLOSS & RAFFLES",
    "description": "For Gloss & Raffles, an interior design studio that also offers furniture with a one-of-a-kind backstory to its customers, we created a unique visual identity and a website to match its distinctive spirit.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-23-gloss-raffles.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-23-gloss-raffles.svg"
  },
  {
    "id": "sexy-zebras",
    "name": "SEXY ZEBRAS 🎤",
    "label": "COCOTA® x SEXY ZEBRAS",
    "description": "To mark the beginning of this rock band's new chapter, we redesigned their brand with an electrifying and eclectic visual identity that reflects their edgy and raw style. The updated aesthetic was incorporated into the album design, merchandise, and guerrilla posters.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-24-sexy-zebras.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-24-sexy-zebras.svg"
  },
  {
    "id": "ursa",
    "name": "URSA",
    "label": "COCOTA® x URSA",
    "description": "Our robust partnership with URSA, one of Europe's leading insulation companies, has been thriving for over a decade, encompassing a broad spectrum of services like brand consulting, communication materials, gifting, and digital design.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-25-ursa.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-25-ursa.svg"
  },
  {
    "id": "finect",
    "name": "FINECT 🏦",
    "label": "COCOTA® x FINECT",
    "description": "By highlighting motion in the visual identity we designed for Asesor Top, Finec's financial consultant talent show, we showcased the event's dynamism and took its essence to the next level.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-26-finect.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-26-finect.svg"
  },
  {
    "id": "unicef",
    "name": "UNICEF 🏡",
    "label": "COCOTA® x UNICEF",
    "description": "We designed an inspiring identity, gifting, and packaging for UNICEF's campaign \"Lives that bear life\" to encourage charitable bequests. The kit included a wooden pencil that can be planted once it's used up, echoing the message while promoting sustainable and circular practices.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-27-unicef.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-27-unicef.svg"
  },
  {
    "id": "dame-la-brasa",
    "name": "DAME LA BRASA 🔥",
    "label": "COCOTA® x DAME LA BRASA",
    "description": "Through our rebranding, we revitalized this American dining spot known for its smoked meat offerings, all while upholding the principles of the slow food movement.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-28-dame-la-brasa.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-28-dame-la-brasa.svg"
  },
  {
    "id": "musotoku",
    "name": "MUSOTOKU",
    "label": "COCOTA® x MUSOTOKU",
    "description": "Throughout our lasting collaboration with Musotoku, we have designed an identity to differentiate this brand leading the tattooing revolution, an innovative packaging for an exciting unboxing experience, and a corporate website with a functional cut and an experimental twist.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-29-musotoku.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-29-musotoku.svg"
  },
  {
    "id": "enresa",
    "name": "ENRESA",
    "label": "COCOTA® x ENRESA",
    "description": "Enresa entrusted our graphic design agency with the task of developing the educational materials for their workshops. We created clear and engaging infographics, as well as accessible PDF designs.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-30-enresa.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-30-enresa.svg"
  },
  {
    "id": "sal-hierbas",
    "name": "SAL DE HIERBAS ENCANTADA",
    "label": "COCOTA® x SHE",
    "description": "For this woman-owned project specializing in crafting herbal salt with plant-based therapeutic formulas, we designed a clean visual identity, packaging, and communication materials to emphasize its minimalistic and artisanal nature.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-31-sal-hierbas.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-31-sal-hierbas.svg"
  },
  {
    "id": "circulo",
    "name": "CÍRCULO",
    "label": "COCOTA® x CÍRCULO",
    "description": "Over the course of a year-long collaboration, we partnered with the start-up Círculo, creating their brand strategy, visual identity, promotional materials, and educational website, all rooted in our mutual holistic beauty approach.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-32-circulo.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-32-circulo.svg"
  },
  {
    "id": "creative-europe",
    "name": "CREATIVE EUROPE",
    "label": "COCOTA® x CREATIVE EUROPE",
    "description": "Our brand identity and rollout for the Creative Europe Office extend beyond mere institutional branding. It underscores the values of diversity and dialogue among cultural stakeholders, as well as building connections with the community.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-33-creative-europe.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-33-creative-europe.svg"
  },
  {
    "id": "albidania",
    "name": "ALBIDANIA",
    "label": "COCOTA® x ALBIDANIA",
    "description": "We spent over seven months collaborating with the Albidania Group, a division of the international Family Office, to design the brand architecture for several of their companies. This involved working on naming, visual identity, and brand rollout.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-34-albidania.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-34-albidania.svg"
  },
  {
    "id": "icex",
    "name": "ICEX",
    "label": "COCOTA® x ICEX",
    "description": "After conducting a phase of research and SEO analysis, we developed the content strategy and accessible digital design for an ICEX digital platform.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-35-icex.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-35-icex.svg"
  },
  {
    "id": "oros",
    "name": "OROS TRAVEL & CULTURE 🎺",
    "label": "COCOTA® x OROS",
    "description": "Our continued partnership with Oros has resulted in a visual identity that highlights the company's cultural values, a website that incorporates music as a key element of the user experience, and promotional materials for different events.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-36-oros.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-36-oros.svg"
  },
  {
    "id": "sponswatch",
    "name": "SPONSWATCH",
    "label": "COCOTA® x SPONSWATCH",
    "description": "We were responsible for designing the user experience and user interface of the digital platform for Sponswatch, a company that leverages state-of-the-art technology and AI to measure sponsorship exposure value across all media.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-37-sponswatch.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-37-sponswatch.svg"
  },
  {
    "id": "kubuka",
    "name": "KUBUKA",
    "label": "COCOTA® x KUBUKA",
    "description": "We worked with the NGO Kubuka as one of our pro bono projects to help purpose-driven organizations, creating communication materials to advocate for sustainable change through education and entrepreneurship.",
    "media": {
      "type": "image",
      "src": "/assets/cocota/clients/client-38-kubuka.webp",
      "alt": "Creative design agency"
    },
    "logo": "/assets/cocota/clients/client-38-kubuka.svg"
  }
] satisfies Client[];

const clientOrderByIndustry: Record<IndustryFilter, readonly string[]> = {
  "All Industries": [
    "rpa",
    "wild",
    "fiet",
    "room-mate",
    "madrid-beyond",
    "amadeus",
    "avolta",
    "havaianas",
    "loewe",
    "sedra",
    "el-corte-ingles",
    "faster-displays",
    "ahec",
    "juventud-madrid",
    "valora",
    "crusto",
    "rubicom",
    "museo-del-traje",
    "quintussa",
    "kinepolis",
    "pichiavo",
    "sincro",
    "gloss-raffles",
    "sexy-zebras",
    "ursa",
    "finect",
    "unicef",
    "dame-la-brasa",
    "musotoku",
    "enresa",
    "sal-hierbas",
    "circulo",
    "creative-europe",
    "albidania",
    "icex",
    "oros",
    "sponswatch",
    "kubuka"
  ],
  "Consulting": [
    "valora",
    "rubicom",
    "sincro",
    "finect",
    "albidania",
    "icex"
  ],
  "Culture": [
    "ahec",
    "juventud-madrid",
    "museo-del-traje",
    "kinepolis",
    "pichiavo",
    "sexy-zebras",
    "creative-europe",
    "oros"
  ],
  "Fashion & Beauty": [
    "wild",
    "avolta",
    "havaianas",
    "loewe",
    "museo-del-traje",
    "quintussa",
    "circulo"
  ],
  "Hospitality": [
    "crusto",
    "dame-la-brasa",
    "sal-hierbas"
  ],
  "Impact": [
    "fiet",
    "rpa",
    "wild",
    "sedra",
    "valora",
    "unicef",
    "circulo",
    "icex",
    "oros",
    "kubuka"
  ],
  "Tech": [
    "amadeus",
    "madrid-beyond",
    "room-mate",
    "faster-displays",
    "finect",
    "musotoku",
    "albidania",
    "sponswatch"
  ],
  "Travel": [
    "amadeus",
    "madrid-beyond",
    "room-mate",
    "avolta",
    "albidania",
    "oros"
  ],
  "Other": [
    "wild",
    "el-corte-ingles",
    "gloss-raffles",
    "ursa",
    "enresa"
  ]
};

const clientsById = new Map(clients.map((client) => [client.id, client]));

export function getClientsForIndustry(industry: IndustryFilter): Client[] {
  return clientOrderByIndustry[industry].map((clientId) => {
    const client = clientsById.get(clientId);

    if (!client) {
      throw new Error(`Missing client data for ${clientId}`);
    }

    return client;
  });
}

