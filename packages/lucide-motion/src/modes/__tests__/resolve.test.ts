import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { builtInModes } from "../index";
import { __resetSignatureWarnings, resolveMode } from "../resolve";
import type { Mode } from "../types";

describe("resolveMode", () => {
  beforeEach(() => {
    __resetSignatureWarnings();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("named modes", () => {
    it("defaults to draw when modeProp is undefined", () => {
      expect(resolveMode(undefined, "heart", undefined)).toBe(builtInModes.draw);
    });

    it("resolves draw by name", () => {
      expect(resolveMode("draw", "heart", undefined)).toBe(builtInModes.draw);
    });
  });

  describe("function-form modes", () => {
    it("wraps a factory in a default-less Mode", () => {
      const factory = vi.fn(() => ({ rest: {}, active: {} }));
      const result = resolveMode(factory, "heart", undefined);
      expect(result.factory).toBe(factory);
      expect(result.defaults).toBeUndefined();
      expect(result.needsTransformOrigin).toBeUndefined();
    });

    it("does not invoke the factory during resolution", () => {
      const factory = vi.fn(() => ({ rest: {}, active: {} }));
      resolveMode(factory, "heart", undefined);
      expect(factory).not.toHaveBeenCalled();
    });
  });

  describe("signature mode", () => {
    it("returns the provided signature", () => {
      const signature: Mode = {
        factory: () => ({ rest: {}, active: {} }),
        defaults: { duration: 0.8 },
        needsTransformOrigin: true,
      };
      const result = resolveMode("signature", "heart", signature);
      expect(result).toBe(signature);
    });

    it("falls back to draw when no signature is registered", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const result = resolveMode("signature", "missing-icon-a", undefined);
      expect(result).toBe(builtInModes.draw);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0]?.[0]).toMatch(
        /mode="signature" used on icon "missing-icon-a"/
      );
    });

    it("emits exactly one warning per icon name across repeated calls", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      resolveMode("signature", "missing-icon-b", undefined);
      resolveMode("signature", "missing-icon-b", undefined);
      resolveMode("signature", "missing-icon-b", undefined);
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it("warns separately for each distinct icon name", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      resolveMode("signature", "missing-icon-c", undefined);
      resolveMode("signature", "missing-icon-d", undefined);
      resolveMode("signature", "missing-icon-c", undefined);
      expect(warnSpy).toHaveBeenCalledTimes(2);
    });

    it("uses 'an unnamed DrawIcon' phrasing when iconName is empty", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      resolveMode("signature", "", undefined);
      expect(warnSpy.mock.calls[0]?.[0]).toMatch(/an unnamed DrawIcon/);
    });

    it("does not warn in production", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.stubEnv("NODE_ENV", "production");
      const result = resolveMode("signature", "missing-icon-prod", undefined);
      expect(result).toBe(builtInModes.draw);
      expect(warnSpy).not.toHaveBeenCalled();
      vi.unstubAllEnvs();
    });
  });
});
