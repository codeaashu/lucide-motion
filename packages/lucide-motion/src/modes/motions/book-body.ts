import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Book body — the host motion for every icon built around the
 * Lucide closed-book shape (book and all -plus / -minus / -check / -x
 * / -alert / -text / -image / -search / -lock / -key / -open / etc.
 * variants). The closed-book is depicted as a single closed-cover
 * outline with the binding spine on the left and a small step at
 * the bottom-left indicating the back cover. Variants that inset a
 * badge (book-key, book-lock, book-up-2, book-search) reshape the
 * body into two fragments — every shape goes in the matcher.
 *
 * **Real-life physics**: a book landing on a shelf or desk. The
 * cover compresses ~1.5% as the spine takes the impact, while the
 * whole book bobs down a third of a pixel. Both return cleanly to
 * rest on a shared `times` schedule.
 *
 * Out of scope: `book-open` / `book-open-text` / `book-open-check`
 * (separate two-page anatomy with a spine line — see
 * `book-open-cover.ts`), `bookmark*` (different shape entirely),
 * `book-copy` / `book-dashed` (different anatomies; signed via the
 * family wildcard).
 *
 * Exports `BOOK_BODY_KEYFRAMES` so `bookModifierReveal` can phase-
 * lock its draw-in with the body's settle.
 */
const BOOK_BODY_PATHS = [
  // Canonical closed-book spine — shared by ~17 variants.
  "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
  // book-key — corner cut for the inset key badge (two fragments)
  "M13 2H6.5A2.5 2.5 0 0 0 4 4.5v15",
  "M20 15.2V21a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
  // book-lock — corner cut for the lock badge (two fragments)
  "M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
  "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10",
  // book-up-2 — split body for the up-arrows badge
  "M18 2h1a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
  "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2",
  // book-search — reshaped for the search loupe at (17, 18)
  "M11 22H5.5a1 1 0 0 1 0-5h4.501",
  "M3 19.5v-15A2.5 2.5 0 0 1 5.5 2H18a1 1 0 0 1 1 1v8",
];

export const BOOK_BODY_KEYFRAMES = {
  // Cover compresses subtly as the book lands — closed cycle.
  scale: [1, 0.985, 1],
  // Settle down a third of a pixel as the book hits the surface.
  y: [0, 0.3, 0],
  // Shared timing so the compression and settle read as one beat.
  times: [0, 0.4, 1],
};

export const bookBody: Motion = {
  matches: matchPathDOneOf(...BOOK_BODY_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1, y: 0 },
    active: {
      scale: BOOK_BODY_KEYFRAMES.scale,
      y: BOOK_BODY_KEYFRAMES.y,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: BOOK_BODY_KEYFRAMES.times,
      },
    },
  }),
};
