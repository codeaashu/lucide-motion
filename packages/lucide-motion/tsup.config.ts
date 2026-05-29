import { defineConfig } from "tsup";

// The build is split into two passes so the "use client" directive lives
// only on the main entry (which uses hooks/Motion) and not on the manifest
// entry (pure data, safely imported from server components).
//
// They MUST run sequentially - running concurrently with `defineConfig([...])`
// races the main pass's `clean: true` against the manifest pass's writes
// and intermittently loses files. The package's build script invokes tsup
// twice with BUILD=main then BUILD=manifest.
const target = process.env.BUILD ?? "main";

const shared = {
  format: ["esm", "cjs"] as const,
  dts: true,
  // Sourcemaps are off for the published tarball — they roughly doubled
  // the unpacked size (~6 MB of maps for ~5 MB of generated code) and
  // consumers shipping minified bundles never read them. Set
  // SOURCEMAP=true on the command line to opt back in for local
  // debugging or release inspection.
  sourcemap: process.env.SOURCEMAP === "true",
  splitting: false,
  external: ["react", "react-dom", "motion", "motion/react"],
};

export default defineConfig(
  target === "manifest"
    ? {
        entry: { manifest: "src/manifest.ts" },
        clean: false,
        ...shared,
      }
    : {
        entry: { index: "src/index.ts" },
        clean: true,
        banner: { js: '"use client";' },
        ...shared,
      }
);
