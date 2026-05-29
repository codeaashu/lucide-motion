# lucide-motion

## 0.4.0

### Minor Changes

- Engine hardening from a React-functionality audit:

  - **Keyboard accessibility for `trigger="click"`.** Click-triggered icons are now focusable and activate on Enter/Space, rendering with `role="button"` and `tabIndex={0}`. Keyboard activation routes through a real click, so it both replays the draw and fires your `onClick`. If you supply your own `role`, `tabIndex`, or `onKeyDown` (e.g. you wrap the icon in a real `<button>`), those are respected and the defaults are not applied. Decorative triggers (`hover`, `mount`, `in-view`, `parent-hover`, `manual`) are unaffected.
  - **`trigger="mount"` fires exactly once** on first paint. A runtime `trigger`/`reducedMotion` change no longer replays it, and React StrictMode's double-invoke now produces a single play.
  - **Reduced motion + imperative handle.** `ref.play()` / `ref.reset()` are no-ops under reduced motion instead of acting on unbound animation controls.
  - **Performance.** Each path's variants are memoized, so the internal `data-motion-state` re-render no longer rebuilds a fresh variants object mid-animation.
  - Internal: migrated `useAnimation` → `useAnimationControls` (motion's current API). No public API change.

  Also adds render-side test coverage (React Testing Library + jsdom) for the trigger state machine, click a11y, the imperative handle, reduced motion, and `MotionIconConfig`.

## 0.3.0

### Breaking Changes

- **Removed the generic modes `pulse`, `spin`, `shake`, and `bounce`.** `mode` now accepts only `"draw"`, `"signature"`, or a custom `ModeFactory`. Generic whole-icon presets read as filler next to the bespoke signatures and diluted the library's identity. **Migration:** swap `mode="pulse" | "spin" | "shake" | "bounce"` for `mode="signature"` (per-icon bespoke animation, falls back to `draw`), or pass your own `ModeFactory` to reproduce the old preset. (Pre-1.0, so shipped in a minor bump per semver's 0.x rule.)

### Minor Changes

- Add bespoke signatures for `message-circle-dashed` (perimeter assembly), `message-circle-more` (typing dots), `message-circle-reply` (reply arrow), and `cloud-sync` (paired sync arrows). Each manifest entry now carries a `hasSignature: boolean` field so consumers can distinguish icons with a real signature from those that fall back to `draw`.

- c42e1a2: Add `bookBody` motion + base `book` signature. Third Round-1 host primitive in the primitives-first roadmap — matches the canonical closed-book spine `d` shared across 17 hosts (`book`, `book-marked`, `book-check`, `book-heart`, `book-text`, `book-image`, ...). The book is one path (closed cover with the binding spine baked in), so the motion is deliberately small: a subtle `scale: [1, 0.985, 1]` + `y: [0, 0.3, 0]` reads as the book landing on a shelf. Exports `BOOK_BODY_KEYFRAMES` so a future `bookModifierReveal` (for `book-plus` / `-minus` / `-check` / `-x` / `-alert`) can phase-lock its draw-in with the body's settle.

  Out of scope for now: `book-open*` (two-page-spread anatomy with a separate spine line), `bookmark*` (different shape entirely), and `book-search` / `book-key` / `book-lock` / `book-copy` / `book-dashed` (use different body `d`s — future work).

- 856958c: Add `calendarFrame` motion + base `calendar` signature. Second Round-1 host primitive in the primitives-first roadmap — covers the calendar body (canonical rect + 13 partial-body paths + notepad-text rect), both pins (`M8 2v4`, `M16 2v4`), and the top divider (`M3 10h18`) shared across 23 catalog icons (`calendar`, `calendar-1`, `calendar-clock`, `calendar-search`, ..., plus the `notepad-text` family which shares the pinned-at-top idiom). The pins pluck UP while the body and divider settle DOWN — reads as a calendar being pinned to a wall. Exports `CALENDAR_FRAME_KEYFRAMES` (`bodyY`, `pinY`, `times`) so future calendar-family motions can phase-lock via per-value `inherit: true`.

  Authoring this primitive first means future composite calendar-\* signatures (calendar-search, calendar-cog, calendar-clock, calendar-heart, ...) just list `calendarFrame` in their `compose({ motions: [...] })` to inherit the host motion. Base calendar icon now ships with a signature; composites land as their badge-subject primitives (`searchLoupe`, `cogGear`, `clockFace`, `heartBeat`, ...) get authored in Round 2.

- 4604165: Calendar-family modifier-reveal + 9 calendar state-marker signatures. `calendarModifierReveal` mirrors the `fileModifierReveal` template — `matchAnyPath` placed last in each composite's compose list, draws the marker stroke on at the body's settle peak (t = 0.4), inherits `CALENDAR_FRAME_KEYFRAMES.bodyY` so markers bob with the calendar through the landing.

  New signatures: `calendar-plus`, `calendar-plus-2`, `calendar-minus`, `calendar-minus-2`, `calendar-check`, `calendar-check-2`, `calendar-x`, `calendar-x-2`, `calendar-off`. The `-2` variants place the marker inside the body rather than the cut-corner badge; `calendar-off` uses the diagonal slash. All are `compose({ motions: [calendarFrame, calendarModifierReveal] })`.

  `calendarFrame` also extended to match `calendar-off`'s split body fragments (`M21 15.5V6...`) and split divider stubs (`M3 10h7`, `M21 10h-5.5`) so they bob with the rest of the frame, leaving only the slash for the wildcard reveal.

- dfc6e93: Eliminate the closed-loop seam — render a clean solid stroke at rest.

  The default `draw` mode previously used Motion's `pathLength` shortcut, which permanently writes `pathLength="1"`, `stroke-dasharray="1 1"`, and `stroke-dashoffset="0"` to every rendered element. On icons whose path starts and ends near the same point (settings gear, cloud, heart, ...) the normalized dash boundary lands on the closure and the two round linecaps render with a visible gap between them. The resting DOM also differed structurally from Lucide's reference SVG, which carries no dash attributes at all.

  The default `draw` mode now measures each element's real path length via `getTotalLength()` and animates `stroke-dashoffset` against a real `stroke-dasharray`. At rest both collapse to `0` (a `0` dasharray is a plain solid stroke, no dash pattern), and a `transitionEnd` resets them after every play so no dash pattern lingers after the animation completes.

  `ModeContext` gains a required `pathLength: number` field carrying the measured length. Anyone building a custom mode by inferring the factory signature (`(ctx) => Variants`) is unaffected — TypeScript infers it. Anyone hand-typing a `ModeContext` literal (typically in tests) will need to add `pathLength` to the object.

  Existing bespoke signature motions in `src/modes/motions/` still use Motion's `pathLength` value internally; they target short open strokes (modifier slashes, plus/minus, single arcs) where the seam isn't visible, and they're scheduled for a follow-up migration to the same dasharray pattern.

- 473b869: Add `fileEnvelope` motion + base `file` signature. First Round-1 host primitive (per the primitives-first roadmap in the signature-authoring skill) — covers the file body and folded corner shared across 50 catalog icons (`file`, `file-text`, `file-code`, `file-search`, `file-archive`, ..., plus `shredder`). The body settles subtly (gentle scale dip + 0.3px y bob) and the corner does a dog-ear flick (-10° rotation around its fold hinge at viewBox position `(14, 2)`). Exports `FILE_ENVELOPE_KEYFRAMES` so future file-family motions can phase-lock with the host via per-value `inherit: true`.

  Authoring this primitive first means future composite file-\* signatures (file-code, file-search, file-cog, ...) just list `fileEnvelope` in their `compose({ motions: [...] })` to inherit the host motion — no duplication. Base `file` icon now ships with a signature; composites land as their badge-subject primitives (`code`, `search`, `cog`, ...) get authored in Round 2.

- 413e546: File-family modifier-reveal + 10 file-\* state-marker signatures. `fileModifierReveal` is the family wildcard (mirrors the `bellModifierReveal` template) — `matchAnyPath` placed last in each composite's compose list. It draws the marker stroke on at the body's settle peak (t = 0.4) and inherits `FILE_ENVELOPE_KEYFRAMES.bodyY` so the marker bobs with the page through the landing.

  New signatures: `file-plus`, `file-minus`, `file-check`, `file-x`, `file-plus-corner`, `file-minus-corner`, `file-check-corner`, `file-x-corner`, `file-question-mark`, `file-exclamation-point`. Each is `compose({ motions: [fileEnvelope, fileModifierReveal] })`. Signed-icon count rises from 138 to 148.

### Patch Changes

- 60134bf: Every signature motion now lands cleanly back at the rest glyph after one play. Six motions had been authored with `active` keyframes whose last value didn't match the rest value, leaving the icon visibly drifted: `cloud-rain-drops` and `cloud-snow-dots` ended with the drop translated downward and invisible; `sun-ray-pulse` left the rays shrunk to 94%; `snowflake-twinkle` to 98%; `mail-modifier-pulse` left warning markers at 18% opacity and 82% scale; `rotate-key-turn` ended at -360°.

  Each is now re-authored as a closed cycle that starts AND ends at the rest value — no engine-level snap, the return is part of the animation. For loop-shaped motions (rain, snow) the cycle wraps the visible fall in opacity-covered teleport beats so the start and end land at rest position invisibly.

  Added a `rest-cycle.test.ts` invariant test that iterates every motion in `src/modes/motions/` via `import.meta.glob`, calls the factory, and asserts each animated property in `active` lands at its `rest` value (literally for most, mod-360 for rotations). Catches this class of bug automatically going forward.

- d294583: Internal: migrate every bespoke signature motion (modifier-reveals, EKG pulse line, volume sound waves, wifi pen-write, wifi signal waves) off Motion's `pathLength` shortcut and onto the same `strokeDasharray` / `strokeDashoffset` pattern the default `draw` mode now uses. Every signed icon at rest now renders with no `pathLength="1"` or `stroke-dasharray="1 1"` attributes on the DOM — consistent with the seam-free solid stroke the default `draw` mode produces. No visual or timing changes to the animations themselves.
- 0496d11: Drop sourcemaps from the published tarball by default. The two `.map` files (`index.js.map` + `index.cjs.map`) were ~5 MB of the ~9 MB unpacked package size and are never read by consumers shipping minified bundles. Set `SOURCEMAP=true pnpm build` locally if you need them for debugging or release inspection.

## 0.2.0

### Minor Changes

- e80a857: Add a `mode` prop for selecting which animation an icon plays.

  - **Four named modes:** `"draw"` (default — current behavior), `"pulse"`, `"spin"`, `"shake"`, `"bounce"`. All compose with the existing trigger/timing/leave-behavior/reduced-motion props.
  - **Signatures:** `mode="signature"` plays the icon's character animation. Initial set covers `heart` (lub-dub beat), `bell` (damped ring), `eye` (blink), `star` (twinkle), `sun` (slow rotate), `loader` (infinite spin). Icons without a registered signature fall back to `"draw"` and emit a one-time dev warning.
  - **Function form:** `mode={(ctx) => Variants}` for fully custom factories that receive the resolved timing context (`duration`, `delay`, `stagger`, `easing`, `repeat`, plus `iconName` and `index`).
  - **App-wide defaults:** new `mode?: ModeName | ModeFactory` on `MotionIconConfig`.
  - **Per-mode timing defaults:** each mode can declare its own preferred timing (e.g. `loader` defaults to `repeat: Infinity`), layered between `MotionIconConfig` and engine defaults so per-icon props always win.
  - **Tree-shaken signatures:** the codegen emits a per-icon side-import for icons that have a signature, so consumers only pay for the signatures of icons they actually use.

  New exported types: `Mode`, `ModeContext`, `ModeDefaults`, `ModeFactory`, `ModeName`.

  Fix: `MotionIconConfig` memoization previously keyed on `JSON.stringify(config)`, which silently collapsed function-valued props (`easing`, and now `mode`) to the same key. Replaced with an explicit dependency array, so inner providers correctly re-evaluate when only a function reference changes.

  Generated icon wrappers now carry an `iconName` prop and (where applicable) a `signature` prop. Per-icon prop types `Omit` both — direct consumers are unaffected.

  No breaking changes. Existing `<Heart />` with no `mode` prop renders identically to before.

## 0.1.0

### Minor Changes

- 979009b: Initial release: 1,700+ animated Lucide icons with hover/click/mount/in-view/parent-hover/manual triggers, MotionIconConfig for app-wide defaults, full Motion variant escape hatch, and RSC-safe `"use client"` boundaries.
