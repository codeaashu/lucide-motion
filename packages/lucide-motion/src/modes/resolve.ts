import { builtInModes } from "./index";
import type { Mode, ModeFactory, ModeName } from "./types";

/**
 * Tracks icon names that have already produced a missing-signature dev
 * warning so we don't spam the console once per render. Module-level so the
 * set persists across the lifetime of the process.
 */
const warnedMissingSignatures = new Set<string>();

/**
 * Resolves the `mode` prop into a concrete {@link Mode}.
 *
 * - Function form: wrapped in a default-less `Mode` (the caller's factory is
 *   the only behavior; engine `DEFAULTS` provide the timing fallbacks).
 * - `"signature"`: returns the supplied signature, or falls back to the
 *   `"draw"` mode if none is registered. In development, emits a one-time
 *   warning per `iconName` so the gap is visible during local work; the
 *   warning is dead-code-eliminated in production via
 *   `process.env.NODE_ENV`.
 * - Named modes (`"draw"`): looked up in the built-in registry.
 * - `undefined`: defaults to `"draw"`.
 */
export function resolveMode(
  modeProp: ModeName | ModeFactory | undefined,
  iconName: string,
  signature: Mode | undefined
): Mode {
  if (typeof modeProp === "function") {
    return { factory: modeProp };
  }
  if (modeProp === "signature") {
    if (signature) return signature;
    if (
      process.env.NODE_ENV !== "production" &&
      !warnedMissingSignatures.has(iconName)
    ) {
      warnedMissingSignatures.add(iconName);
      const subject = iconName
        ? `icon "${iconName}"`
        : "an unnamed DrawIcon";
      console.warn(
        `[lucide-motion] mode="signature" used on ${subject} with no signature registered. Falling back to mode="draw".`
      );
    }
    return builtInModes.draw;
  }
  return builtInModes[modeProp ?? "draw"];
}

/**
 * Test-only: clear the dedup cache for missing-signature warnings. Used by
 * the test suite to assert warning-fires-once behavior across cases. Not
 * exported from the package barrel.
 */
export function __resetSignatureWarnings(): void {
  warnedMissingSignatures.clear();
}
