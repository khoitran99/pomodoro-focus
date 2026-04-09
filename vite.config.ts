import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function listPublicAssetFiles(directory: string) {
  const absoluteDirectory = path.join(projectRoot, "public", directory);

  if (!fs.existsSync(absoluteDirectory)) {
    return [];
  }

  return fs
    .readdirSync(absoluteDirectory)
    .filter((filename) =>
      imageExtensions.has(path.extname(filename).toLowerCase()),
    )
    .sort((left, right) => left.localeCompare(right));
}

const localBackgroundFiles = listPublicAssetFiles("background");
const localThumbnailFiles = listPublicAssetFiles("thumbnails");

const config = defineConfig(({ command }) => ({
  publicDir: "public",
  define: {
    __LOCAL_BACKGROUND_FILES__: JSON.stringify(localBackgroundFiles),
    __LOCAL_THUMBNAIL_FILES__: JSON.stringify(localThumbnailFiles),
  },
  plugins: [
    ...(command === "serve" ? [devtools()] : []),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    viteReact(),
  ],
}));

export default config;
