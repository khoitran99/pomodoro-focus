import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig(({ command }) => ({
  publicDir: "public",
  plugins: [
    ...(command === "serve" ? [devtools()] : []),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    viteReact(),
  ],
}));

export default config;
