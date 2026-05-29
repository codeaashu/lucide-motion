import { matchAnyPath, type Motion } from "../compose";
import { spinFactory } from "./atom/spin";

/**
 * Continuous whole-icon spin. The loader's 8 radial rays all rotate
 * together. Built on the shared `spinFactory`; the signature supplies the
 * infinite-repeat default.
 */
export const loaderSpin: Motion = {
  matches: matchAnyPath,
  factory: spinFactory,
};
