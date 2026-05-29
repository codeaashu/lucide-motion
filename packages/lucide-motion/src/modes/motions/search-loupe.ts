import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Search loupe — the magnifying-glass head + handle Lucide draws
 * across every search-bearing icon. Canonical "search-action"
 * gesture: damped side-to-side rotation wobble around the loupe's
 * own centre, reading as the magnifier tilting to inspect a target.
 *
 * Per-iconName centre lookup in `SEARCH_LOUPE_CENTERS` sets the
 * pivot per composite via per-variant `transformOrigin` resolved
 * against `transformBox: "view-box"` — so each composite's loupe
 * wobbles around its own centre without disturbing the host's
 * pivot. Same pattern as `cog-gear`'s `COG_CENTERS`.
 *
 * Matcher is scoped to icons whose iconName appears in
 * `SEARCH_LOUPE_CENTERS` so the loupe path / circle predicates
 * never claim look-alike elements in unrelated icons.
 *
 * Coverage today: standalone `search` (and `search-{check,x,slash,
 * code,alert}` state-marker variants), `scan-search`, `mail-search`,
 * `folder-search`, `folder-search-2`. Add a row to
 * `SEARCH_LOUPE_CENTERS` + extend `LOUPE_HANDLE_DS` /
 * `LOUPE_CIRCLE_KEYS` whenever a new search-bearing family is
 * signed.
 *
 * Place this FIRST in every search-bearing signature so the loupe
 * circle + handle are claimed by the wobble before the host family
 * modifier-reveal would draw them on as state markers.
 *
 * Exports `SEARCH_LOUPE_KEYFRAMES` so `searchModifierReveal` can
 * inherit the rotation directly (state-marker glyphs inside the
 * search-* family ride the wobble after they draw in).
 */
export const SEARCH_LOUPE_KEYFRAMES: {
  rotate: number[];
  times: number[];
} = {
  // Damped wobble: tilt left hard, tilt right less, settle through
  // smaller swings — reads as inspecting from a few angles.
  rotate: [0, -10, 8, -5, 2, 0],
  times: [0, 0.18, 0.36, 0.55, 0.78, 1],
};

/**
 * Per-iconName loupe centre in user units. The factory sets
 * `transformOrigin` to this value so each composite's wobble
 * pivots around its own loupe.
 */
const SEARCH_LOUPE_CENTERS: Record<string, [number, number]> = {
  // search-* family — base loupe at (11, 11)
  search: [11, 11],
  "search-check": [11, 11],
  "search-x": [11, 11],
  "search-slash": [11, 11],
  "search-code": [11, 11],
  "search-alert": [11, 11],
  // Composite loupes
  "scan-search": [12, 12],
  "mail-search": [18, 18],
  "folder-search": [17, 17],
  "folder-search-2": [11.5, 12.5],
  "calendar-search": [18, 18],
  "book-search": [17, 18],
  "file-search": [11.5, 14.5],
  "file-search-corner": [16, 17],
};

/**
 * Every loupe handle `d` Lucide uses across search-bearing icons,
 * plus (for `mail-search`) the loupe drawn as a `<path>` instead of
 * a `<circle>` for renderer compatibility.
 */
const LOUPE_HANDLE_DS = new Set<string>([
  // search-* family handles
  "m21 21-4.34-4.34", // base search
  "m21 21-4.3-4.3", // every search-{check,x,slash,code,alert} variant
  // scan-search
  "m16 16-1.9-1.9",
  // mail-search
  "M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", // the loupe circle drawn as a path
  "m22 22-1.5-1.5",
  // folder-search
  "m21 21-1.9-1.9",
  // folder-search-2
  "M13.3 14.3 15 16",
  // calendar-search
  "m22 22-1.875-1.875",
  // book-search
  "m21 22-1.879-1.878",
  // file-search
  "M13.3 16.3 15 18",
  // file-search-corner
  "m21 22-2.88-2.88",
]);

/**
 * Loupe circles by `cx,cy,r` string. Scoped via the iconName guard
 * below so we don't claim unrelated `r=3` circles in other icons.
 */
const LOUPE_CIRCLE_KEYS = new Set<string>([
  "11,11,8", // search (base)
  "18,18,3", // mail-search
  "12,12,3", // scan-search
  "17,17,3", // folder-search
  "11.5,12.5,2.5", // folder-search-2
  "17,18,3", // book-search
  "11.5,14.5,2.5", // file-search
  "16,17,3", // file-search-corner
]);

function matchesLoupe(ctx: ModeContext): boolean {
  if (!(ctx.iconName in SEARCH_LOUPE_CENTERS)) return false;
  if (ctx.pathTag === "path") {
    return LOUPE_HANDLE_DS.has(String(ctx.pathAttrs.d));
  }
  if (ctx.pathTag === "circle") {
    const key = `${ctx.pathAttrs.cx},${ctx.pathAttrs.cy},${ctx.pathAttrs.r}`;
    return LOUPE_CIRCLE_KEYS.has(key);
  }
  return false;
}

export const searchLoupe: Motion = {
  matches: matchesLoupe,
  factory: (ctx) => {
    const [cx, cy] = SEARCH_LOUPE_CENTERS[ctx.iconName] ?? [12, 12];
    const origin = `${cx}px ${cy}px`;
    return {
      rest: { rotate: 0, transformOrigin: origin },
      active: {
        rotate: SEARCH_LOUPE_KEYFRAMES.rotate,
        transformOrigin: origin,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          ease: "easeInOut",
          times: SEARCH_LOUPE_KEYFRAMES.times,
        },
      },
    };
  },
};
