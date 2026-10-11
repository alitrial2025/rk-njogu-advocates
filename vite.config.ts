import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "build-revision",
      transformIndexHtml() {
        return [
          {
            tag: "meta",
            attrs: {
              name: "build-revision",
              content: process.env.GITHUB_SHA ?? "local",
            },
            injectTo: "head",
          },
        ];
      },
    },
  ],
  base: process.env.GITHUB_PAGES === "true" ? "/rk-njogu-advocates/" : "/",
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
