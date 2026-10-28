import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@usememos\/ui$/,
        replacement: new URL("../../packages/react/src/index.ts", import.meta.url).pathname,
      },
      {
        find: /^@usememos\/ui\/theme\.css$/,
        replacement: new URL("../../packages/theme/src/theme.css", import.meta.url).pathname,
      },
    ],
  },
});
