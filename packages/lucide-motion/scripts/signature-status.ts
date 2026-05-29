/**
 * Reports current signature coverage across all Lucide icons.
 *
 * Reads `lucide-static`'s full icon list and the signature files in
 * `src/modes/signatures/`, groups by family (first hyphen segment), and
 * prints a coverage summary. Run via `pnpm status` inside the lib package
 * or `pnpm --filter lucide-motion status` from the repo root.
 *
 * Filesystem-sourced, so it's always current. Pair with the priority
 * roadmap in `docs/signatures.md` section 7 to decide what to tackle next.
 *
 * Flags:
 *   --all    Show every pending family (default truncates at 50).
 *   --json   Emit a JSON blob instead of the human-readable report.
 */

import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");
const require_ = createRequire(import.meta.url);

const iconNodesPath = require_.resolve("lucide-static/icon-nodes.json");
const iconNodes = JSON.parse(
  readFileSync(iconNodesPath, "utf8")
) as Record<string, unknown>;
const allIcons = Object.keys(iconNodes).sort();

const signaturesDir = join(pkgRoot, "src", "modes", "signatures");
const signedIcons = new Set(
  readdirSync(signaturesDir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.slice(0, -3))
);

function familyOf(name: string): string {
  const idx = name.indexOf("-");
  return idx === -1 ? name : name.slice(0, idx);
}

interface FamilyInfo {
  family: string;
  icons: string[];
  signed: string[];
  pending: string[];
}

const families = new Map<string, FamilyInfo>();
for (const name of allIcons) {
  const family = familyOf(name);
  let entry = families.get(family);
  if (!entry) {
    entry = { family, icons: [], signed: [], pending: [] };
    families.set(family, entry);
  }
  entry.icons.push(name);
  if (signedIcons.has(name)) entry.signed.push(name);
  else entry.pending.push(name);
}

const familyList = Array.from(families.values()).sort((a, b) => {
  // Fully-signed first, then partial, then pending. Alphabetical within each.
  const aState = a.signed.length === a.icons.length ? 0
    : a.signed.length > 0 ? 1 : 2;
  const bState = b.signed.length === b.icons.length ? 0
    : b.signed.length > 0 ? 1 : 2;
  if (aState !== bState) return aState - bState;
  return a.family.localeCompare(b.family);
});

const done = familyList.filter((f) => f.signed.length === f.icons.length);
const partial = familyList.filter(
  (f) => f.signed.length > 0 && f.signed.length < f.icons.length
);
const pending = familyList.filter((f) => f.signed.length === 0);

const args = process.argv.slice(2);
const showAll = args.includes("--all");
const asJson = args.includes("--json");

if (asJson) {
  console.log(
    JSON.stringify(
      {
        totalIcons: allIcons.length,
        totalSigned: signedIcons.size,
        coveragePercent: Number(
          ((100 * signedIcons.size) / allIcons.length).toFixed(2)
        ),
        families: familyList.map((f) => ({
          family: f.family,
          total: f.icons.length,
          signed: f.signed,
          pending: f.pending,
          status:
            f.signed.length === f.icons.length
              ? "done"
              : f.signed.length > 0
                ? "partial"
                : "pending",
        })),
      },
      null,
      2
    )
  );
  process.exit(0);
}

console.log(`Signature coverage`);
console.log(`==================`);
console.log(``);
console.log(
  `Signed: ${signedIcons.size} / ${allIcons.length} icons (${(
    (100 * signedIcons.size) /
    allIcons.length
  ).toFixed(2)}%)`
);
console.log(`Families: ${families.size} total`);
console.log(
  `  ${done.length} done · ${partial.length} partial · ${pending.length} pending`
);
console.log(``);

if (done.length > 0) {
  console.log(`Done (${done.length}):`);
  for (const f of done) {
    console.log(`  ✓ ${f.family} (${f.signed.length}/${f.icons.length})`);
  }
  console.log(``);
}

if (partial.length > 0) {
  console.log(`Partial (${partial.length}):`);
  for (const f of partial) {
    console.log(`  ◐ ${f.family} (${f.signed.length}/${f.icons.length})`);
    console.log(`     pending: ${f.pending.join(", ")}`);
  }
  console.log(``);
}

console.log(`Pending (${pending.length}):`);
const pendingToShow = showAll ? pending : pending.slice(0, 50);
for (const f of pendingToShow) {
  console.log(`  ○ ${f.family} (${f.icons.length})`);
}
if (!showAll && pending.length > 50) {
  console.log(
    `  … and ${pending.length - 50} more pending families (pass --all to list)`
  );
}
