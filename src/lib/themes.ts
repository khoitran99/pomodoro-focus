import { imageThemes, themes, type ThemeAsset } from "@/lib/media";

export type ThemeType = "image";

export interface ThemeConfig extends ThemeAsset {
  type: ThemeType;
  value: string;
  thumbnailValue: string;
}

export const themesWithMetadata: ThemeConfig[] = themes.map((theme) => ({
  ...theme,
  type: "image",
  value: theme.fullSrc,
  thumbnailValue: theme.thumbnailSrc,
}));

export { imageThemes, themes };

export const themeGradients: Record<string, string> = {};
