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
  {
    id: "image-rain",
    name: "Rainy Window",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    type: "color",
    value: "from-orange-900 via-rose-900 to-purple-950",
  },
  {
    id: "image-zen",
    name: "Zen Garden",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-cyberpunk",
    name: "Neon City",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-library",
    name: "Classic Library",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-winter",
    name: "Winter Cabin",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-spring",
    name: "Spring Blossom",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-autumn",
    name: "Autumn Leaves",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-mountains",
    name: "Mountain Peaks",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-desert",
    name: "Desert Dunes",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-lavender",
    name: "Lavender Field",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-aurora",
    name: "Northern Lights",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "image-underwater",
    name: "Deep Ocean",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80",
  },
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    type: "color",
    value: "from-violet-950 via-purple-950 to-black",
  },
  {
    id: "ethereal-dawn",
    name: "Ethereal Dawn",
    type: "color",
    value: "from-slate-900 via-fuchsia-950 to-slate-950",
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
