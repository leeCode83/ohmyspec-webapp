import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Vitest runs the pure-logic unit tests only (lib/**/*.test.ts). UI is
// verified by the manual walkthrough (frontend spec §5) — no E2E.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
