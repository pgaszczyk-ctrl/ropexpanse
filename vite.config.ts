import { defineConfig } from "vite";

// The published build knows which commit it is (GitHub Actions sets these), so the game
// can tell when the browser still runs an older copy than the one on the server.
const build = process.env.GITHUB_SHA
  ? `${process.env.GITHUB_REF_NAME ?? ""} ${process.env.GITHUB_SHA.slice(0, 7)}`.trim()
  : "dev";

export default defineConfig({
  base: "./",
  server: { allowedHosts: ["terminal.local"] },
  define: { __BUILD__: JSON.stringify(build) },
});
