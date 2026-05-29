import { draw } from "./draw";
import type { Mode, ModeName } from "./types";

export type {
  Mode,
  ModeContext,
  ModeDefaults,
  ModeFactory,
  ModeName,
} from "./types";

export { resolveMode } from "./resolve";

/**
 * Modes resolvable directly by string name. `"signature"` is handled
 * separately by the engine — it looks up a per-icon entry from the
 * signature registry and falls back to `"draw"` when no entry exists.
 */
export const builtInModes: Record<Exclude<ModeName, "signature">, Mode> = {
  draw,
};
