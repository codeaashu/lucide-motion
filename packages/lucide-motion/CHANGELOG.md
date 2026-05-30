# lucide-motion

## v1

### Breaking Changes

- Removed generic modes `pulse`, `spin`, `shake`, and `bounce`.
- `mode` now supports `draw`, `signature`, or a custom `ModeFactory`.

### Major Features

- Initial public release of animated Lucide icons for React with Motion.
- 1,700+ generated icons with trigger support: `hover`, `click`, `mount`, `in-view`, `parent-hover`, and `manual`.
- Added `MotionIconConfig` for app-wide defaults.
- Added full Motion variant escape hatch for advanced customization.
- Added RSC-safe `"use client"` boundaries.
- Added `mode` prop with named and custom mode factories.
- Added signature mode system and expanded signature coverage across icon families.
- Added `hasSignature` metadata in the manifest.

### Engine, API, and Behavior Updates

- Click trigger accessibility hardening:
  - Click-triggered icons are keyboard focusable.
  - Enter/Space activation triggers click behavior.
  - Honors user-provided `role`, `tabIndex`, and `onKeyDown`.
- Mount trigger now runs exactly once on first paint.
- Reduced-motion behavior improved for imperative API (`play`/`reset` no-op under reduced motion).
- Internal migration to `useAnimationControls`.
- Per-path variants memoized to avoid unnecessary variant object churn during state updates.
- `ModeContext` includes measured `pathLength` for custom mode implementations.

### Animation Quality and Rendering Updates

- Eliminated visible closed-loop seam artifacts in draw mode.
- Default draw mode now uses measured `strokeDasharray`/`strokeDashoffset` behavior for cleaner rest state.
- Added transition-end reset to prevent lingering dash artifacts after playback.
- Migrated signature motion internals away from Motion `pathLength` shortcut for cleaner rest DOM.
- Fixed multiple motions to always return to exact rest glyph state after one play.

### Signature Expansion Highlights

- Added and expanded bespoke signatures across families, including:
  - `message-circle-dashed`, `message-circle-more`, `message-circle-reply`, `cloud-sync`
  - File family foundation and file marker variants
  - Calendar family foundation and calendar marker variants
  - Book family foundation
- Added reusable primitive/keyframe building blocks for host families (file, calendar, book).

### Tooling, Tests, and Packaging

- Added render-side and behavior coverage for trigger state machine, click accessibility, imperative handle, reduced motion, and config behavior.
- Added rest-cycle invariant tests for motion factories.
- Improved function-sensitive config memoization handling.
- Dropped sourcemaps from published tarball by default to reduce package size.
- Continued tree-shaken signature import behavior so consumers only pull what they use.
