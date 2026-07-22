export type Work = {
  title: string;
  category: string;
  description: string;
  emoji: string;
  image: string;
  shape: "portrait" | "landscape";
  size: "small" | "large";
};

export type NewsItem = {
  tag: string;
  title: string;
  image: string;
  imageAlt: string;
  tagTone:
    | "taupe"
    | "red"
    | "orange"
    | "tan"
    | "slate"
    | "gray"
    | "blue"
    | "black"
    | "charcoal"
    | "royal"
    | "purple";
  href?: string;
};

export const works: Work[] = [
  {
    title: "Havaianas",
    category: "Campaigns",
    description: "Taking the free-spirited essence of Havaianas worldwide.",
    emoji: "🩴",
    image: "/assets/cocota/work-havaianas.webp",
    shape: "portrait",
    size: "small",
  },
  {
    title: "Wild",
    category: "Fashion & Beauty",
    description: "Branding for a self-care brand that celebrates emotional life.",
    emoji: "🫧",
    image: "/assets/cocota/work-wild.webp",
    shape: "landscape",
    size: "large",
  },
  {
    title: "Faster Displays",
    category: "Branding; Web Design",
    description: "From cardboard to technology through scrollytelling.",
    emoji: "📦",
    image: "/assets/cocota/work-faster.webp",
    shape: "landscape",
    size: "large",
  },
  {
    title: "Musotoku",
    category: "Branding; Web Design",
    description: "Leading the world of tattooing.",
    emoji: "🚀",
    image: "/assets/cocota/work-musotoku.webp",
    shape: "landscape",
    size: "small",
  },
];

export const newsItems: NewsItem[] = [
  {
    tag: "Studio Insights",
    title: "Don’t miss a thing! Join our Newsletter 📩",
    image: "/assets/cocota/news/news-01-newsletter.webp",
    imageAlt: "Creative design agency",
    tagTone: "taupe",
    href: "https://mailchi.mp/f3f7e4854738/newsletter",
  },
  {
    tag: "Studio Insights",
    title: "Success Story Talk about IA at the EMEA WEConnect Conference 🎤",
    image: "/assets/cocota/news/news-02-weconnect-conference.webp",
    imageAlt: "Creative design agency",
    tagTone: "red",
  },
  {
    tag: "Design leadership",
    title: "Cocota’s CEO named Lovie Awards Jury🏅",
    image: "/assets/cocota/news/news-03-lovie-jury.webp",
    imageAlt: "Creative design agency",
    tagTone: "orange",
  },
  {
    tag: "Just Launched",
    title: "Branding of a beauty oil UK based company",
    image: "/assets/cocota/news/news-04-wild.webp",
    imageAlt: "Creative design agency",
    tagTone: "tan",
  },
  {
    tag: "Campaign Launch",
    title: "Havaianas 🏖️ 2025 Activation in European Stores",
    image: "/assets/cocota/news/news-05-havaianas-launch.webp",
    imageAlt: "Havaianas activation by Cocota Brand & Design Studio",
    tagTone: "red",
  },
  {
    tag: "Work in Progress",
    title: "Branding of a care provider UK based company",
    image: "/assets/cocota/news/news-06-spire.webp",
    imageAlt: "Creative design agency",
    tagTone: "slate",
  },
  {
    tag: "Studio insights",
    title: "DISC Personality Workshop",
    image: "/assets/cocota/news/news-07-disc-workshop.webp",
    imageAlt: "Creative design agency",
    tagTone: "gray",
  },
  {
    tag: "Events",
    title: "We organized a fun afterwork event for international business leaders",
    image: "/assets/cocota/news/news-08-bbnight.webp",
    imageAlt: "Creative design agency",
    tagTone: "blue",
  },
  {
    tag: "Design leaderhip",
    title: "Cocota’s Creative Director Teaching Interface Design at UPV, 2026",
    image: "/assets/cocota/news/news-09-upv-interface-design.webp",
    imageAlt: "Creative design agency",
    tagTone: "black",
  },
  {
    tag: "Studio Talks",
    title: "Talk 🎤 Stratosferica Madrid Urban City Walks on February 26-28",
    image: "/assets/cocota/news/news-10-stratosferica.webp",
    imageAlt: "Creative design agency",
    tagTone: "charcoal",
  },
  {
    tag: "Recognitions",
    title: "Cocota, Site of the Day at the Awwwards🏅",
    image: "/assets/cocota/news/news-11-awwwards.webp",
    imageAlt: "Creative design agency",
    tagTone: "orange",
    href: "https://www.awwwards.com/sites/cocota",
  },
  {
    tag: "Studio Talks",
    title: "Talk 🎤 at  Europe Supplier Diversity & Inclusion Conferece in Paris",
    image: "/assets/cocota/news/news-12-paris-conference.webp",
    imageAlt: "Carmen at a conference",
    tagTone: "royal",
    href: "https://weconnectinternational.org/europe-conference-2024/",
  },
  {
    tag: "Recognition",
    title: "European Design Awards 2024 Winners in Digital Design 🥈",
    image: "/assets/cocota/news/news-13-european-design-awards.webp",
    imageAlt: "Creative design agency",
    tagTone: "purple",
    href: "https://awards.europeandesign.org/winner/260260",
  },
];

export const awardLines = [
  "2x Awwwards Site of the Day",
  "6x Awwwards Honorable Mention",
  "2x ADG Laus Gold",
  "1x ADG Laus Silver",
  "9x ADG Laus Bronze",
  "2x FWA Site Of The Day",
  "1x Lovie Award Gold",
  "2x CSSDA Site of the Day",
  "4x CSS Winner Site Of The Day",
  "5x Mindsparkle Mag Site of the Day",
  "2x European Design Awards",
];
