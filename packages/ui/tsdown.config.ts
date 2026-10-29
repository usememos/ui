import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: "esm",
  platform: "neutral",
  dts: true,
  clean: true,
  copy: ["src/styles/tokens.css", "src/styles/styles.css"],
});
