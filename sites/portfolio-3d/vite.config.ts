import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/portfolio-3d/",
  build: { outDir: "../../portfolio-3d", emptyOutDir: true },
});
