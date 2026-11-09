import { defineConfig } from "vite";
import { execSync } from "node:child_process";

// Build label shown in diagnostic reports: commit and build time.
let commit = "dev";
try {
  commit = execSync("git rev-parse --short HEAD").toString().trim();
} catch {
  /* Not a git checkout. */
}
export default defineConfig({
  base: "./",
  define: { __BUILD__: JSON.stringify(`${commit} · ${new Date().toISOString().slice(0, 16)}`) },
});
