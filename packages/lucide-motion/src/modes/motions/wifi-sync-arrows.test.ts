import { describe, expect, it } from "vitest";
import type { ModeContext } from "../types";
import {
  WIFI_SYNC_ARROW_KEYFRAMES,
  wifiSyncArrows,
} from "./wifi-sync-arrows";

const baseCtx: ModeContext = {
  iconName: "wifi-sync",
  index: 3,
  pathTag: "path",
  pathAttrs: { d: "M11.965 10.105v4L13.5 12.5a5 5 0 0 1 8 1.5" },
  duration: 1.2,
  delay: 0.2,
  stagger: 0.055,
  easing: "easeOut",
  repeat: 0,
  pathLength: 100,
};

describe("wifiSyncArrows", () => {
  it("matches the sync arrow fragments", () => {
    expect(wifiSyncArrows.matches(baseCtx)).toBe(true);
    expect(
      wifiSyncArrows.matches({
        ...baseCtx,
        pathAttrs: { d: "M8.5 16.429a5 5 0 0 1 7 0" },
      })
    ).toBe(false);
  });

  it("uses one refresh-ccw-style wheel rotation around the badge center", () => {
    const variants = wifiSyncArrows.factory(baseCtx);

    expect(variants.rest).toMatchObject({
      scale: 1,
      rotate: 0,
      transformBox: "view-box",
      transformOrigin: "16.965px 16.105px",
    });
    expect(variants.active).toMatchObject({
      scale: WIFI_SYNC_ARROW_KEYFRAMES.scale,
      rotate: WIFI_SYNC_ARROW_KEYFRAMES.rotate,
      transformBox: "view-box",
      transformOrigin: "16.965px 16.105px",
      transition: {
        duration: baseCtx.duration,
        delay: baseCtx.delay,
        repeat: baseCtx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: WIFI_SYNC_ARROW_KEYFRAMES.times,
        },
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: WIFI_SYNC_ARROW_KEYFRAMES.times,
        },
      },
    });
  });
});
