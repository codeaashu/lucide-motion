import { describe, expect, it } from "vitest";
import type { ModeContext } from "../types";
import {
  CLOUD_SYNC_ARROW_KEYFRAMES,
  cloudSyncArrows,
} from "./cloud-sync-arrows";

const baseCtx: ModeContext = {
  iconName: "cloud-sync",
  index: 1,
  pathTag: "path",
  pathAttrs: { d: "m17 18-1.535 1.605a5 5 0 0 1-8-1.5" },
  duration: 1.4,
  delay: 0.2,
  stagger: 0.06,
  easing: "easeInOut",
  repeat: 0,
  pathLength: 100,
};

describe("cloudSyncArrows", () => {
  it("matches the four sync-arrow fragments and skips the cloud body", () => {
    expect(cloudSyncArrows.matches(baseCtx)).toBe(true);
    expect(
      cloudSyncArrows.matches({
        ...baseCtx,
        pathAttrs: { d: "M17 22v-4h-4" },
      })
    ).toBe(true);
    expect(
      cloudSyncArrows.matches({
        ...baseCtx,
        pathAttrs: {
          d: "M20.996 15.251A4.5 4.5 0 0 0 17.495 8h-1.79a7 7 0 1 0-12.709 5.607",
        },
      })
    ).toBe(false);
  });

  it("rotates the wheel ccw around the (12, 16) badge center", () => {
    const variants = cloudSyncArrows.factory(baseCtx);

    expect(variants.rest).toMatchObject({
      scale: 1,
      rotate: 0,
      transformBox: "view-box",
      transformOrigin: "12px 16px",
    });
    expect(variants.active).toMatchObject({
      scale: CLOUD_SYNC_ARROW_KEYFRAMES.scale,
      rotate: CLOUD_SYNC_ARROW_KEYFRAMES.rotate,
      transformBox: "view-box",
      transformOrigin: "12px 16px",
      transition: {
        duration: baseCtx.duration,
        delay: baseCtx.delay,
        repeat: baseCtx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: CLOUD_SYNC_ARROW_KEYFRAMES.times,
        },
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: CLOUD_SYNC_ARROW_KEYFRAMES.times,
        },
      },
    });
  });
});
