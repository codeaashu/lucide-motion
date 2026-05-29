import { defineConfig } from "vitest/config";

// Two kinds of tests live here:
//   - Pure-function tests (`*.test.ts`) — resolver/variant logic with zero
//     React dependency. Run in the default Node environment.
//   - Render-side tests (`*.test.tsx`) — exercise the engine's React state
//     machine. They opt into jsdom per-file with a `// @vitest-environment
//     jsdom` docblock so the Node tests stay fast.
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
