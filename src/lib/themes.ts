export type ThemeType = "color" | "image";

export interface ThemeConfig {
  id: string;
  name: string;
  type: ThemeType;
  value: string; // Tailwind gradient classes or Image URL
}

export const themes: ThemeConfig[] = [
  {
    id: "midnight",
    name: "Midnight Calm",
    type: "color",
    value: "from-fuchsia-950 via-indigo-950 to-rose-950",
  },
  {
    id: "forest",
    name: "Deep Forest",
    type: "color",
    value: "from-emerald-950 via-teal-900 to-cyan-950",
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    type: "color",
    value: "from-cyan-950 via-blue-900 to-indigo-950",
  },
  {
    id: "image-beach",
    name: "Serene Beach",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-city",
    name: "City at Night",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-coffee",
    name: "Cozy Cafe",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-study",
    name: "Study Desk",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-forest",
    name: "Misty Forest",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-sky",
    name: "Clear Sky",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-galaxy",
    name: "Deep Galaxy",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-mars",
    name: "Red Mars",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-blackhole",
    name: "Black Hole",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&w=1920&q=80",
  },
];

export const themeGradients = themes
  .filter((t) => t.type === "color")
  .reduce(
    (acc, theme) => {
      acc[theme.id] = theme.value;
      return acc;
    },
    {} as Record<string, string>,
  );

export const imageThemes = themes
  .filter((t) => t.type === "image")
  .reduce(
    (acc, theme) => {
      acc[theme.id] = theme.value;
      return acc;
    },
    {} as Record<string, string>,
  );
