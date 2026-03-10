export type ThemeType = "image";

export interface ThemeConfig {
  id: string;
  name: string;
  type: ThemeType;
  value: string; // Image URL
}

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL || "";

// Static list of images hosted on S3 or locally
const backgroundFiles = [
  "anne-roston-zq-yhUkIyuI-unsplash.jpg",
  "cristina-gottardi-CSpjU6hYo_0-unsplash.jpg",
  "garrett-parker-DlkF4-dbCOU-unsplash.jpg",
  "grant-ritchie-x1w_Q78xNEY-unsplash.jpg",
  "ian-dooley-DuBNA1QMpPA-unsplash.jpg",
  "julien-moreau-688Fna1pwOQ-unsplash.jpg",
  "matthew-hicks-k9oaPaG8EQw-unsplash.jpg",
  "milad-fakurian-DjjaZybYx4I-unsplash.jpg",
  "milad-fakurian-u8Jn2rzYIps-unsplash.jpg",
  "nasa-V4ZksNimxLk-unsplash.jpg",
  "nir-himi-SDKQYT69cSQ-unsplash.jpg",
  "piotr-chrobot-6oUsyeYXgTg-unsplash.jpg",
  "robert-lukeman-_RBcxo9AU-U-unsplash.jpg",
  "sebastian-svenson-LpbyDENbQQg-unsplash.jpg",
  "warren-umoh-aQVnWyP3AYA-unsplash.jpg",
];

const generateThemes = (): ThemeConfig[] => {
  const generatedThemes: ThemeConfig[] = [];

  for (const filename of backgroundFiles) {
    // Clean up filename to create a nice readable name
    // 1. Remove extension
    // 2. Remove Unsplash ID strings (typically look like -zq-yhUkIyuI-) if they exist
    // 3. Replace dashes with spaces
    // 4. Title case
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const cleanName = nameWithoutExt
      .replace(/-[A-Za-z0-9_-]+-unsplash/g, "") // strip unsplash suffixes
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (l) => l.toUpperCase());

    // Generate a safe ID
    const id = `bg-${nameWithoutExt.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    generatedThemes.push({
      id,
      name: cleanName || "Background",
      type: "image",
      value: `${S3_BASE_URL}/background/${filename}`,
    });
  }

  // Fallback if the folder is empty so the app doesn't crash
  if (generatedThemes.length === 0) {
    generatedThemes.push({
      id: "default-bg",
      name: "Default Background",
      type: "image",
      value:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
    });
  }

  return generatedThemes;
};

export const themes: ThemeConfig[] = generateThemes();

export const imageThemes = themes.reduce(
  (acc, theme) => {
    acc[theme.id] = theme.value;
    return acc;
  },
  {} as Record<string, string>,
);

// Empty object to satisfy backwards compatibility during component refactors
export const themeGradients: Record<string, string> = {};
