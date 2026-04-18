// Shared TypeScript types for all character configs and page components.

// Seven required color tokens every character page uses
export type Palette = {
  bg: string;
  surface: string;
  card: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
};

// Origin story, genre/tone tags, and known aliases
export type CharacterMeta = {
  origin: string;
  tags: string[];
  aliases: string[];
};

// A single lore section — heading + body prose
export type LoreBlock = {
  heading: string;
  body: string;
};

// One release in a discography — for musician characters
export type DiscographyEntry = {
  title: string;
  year: number;
  tracks?: number;
  note?: string;
  coverArt?: string;
};

// Gallery entry for visual releases/projects
export type GalleryEntry = {
  title: string;
  image: string;
  year?: number;
};

// One story arc — for comic/show characters
export type StoryArc = {
  title: string;
  year: number;
  note?: string;
  image?: string;
};

// Root config shape — every character file exports one of these
export type CharacterConfig = {
  id: string;
  slug: string;
  displayName: string;
  palette: Palette;
  meta: CharacterMeta;
  lore: LoreBlock[];
  discography?: DiscographyEntry[];
  arcs?: StoryArc[];
  gallery?: GalleryEntry[];
};
