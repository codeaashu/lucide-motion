import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Cog gear — the canonical "settings/configure" subject across the
 * Lucide catalog. Appears either as the standalone `cog` icon
 * (twelve teeth + two concentric circles centred at (12, 12)) or as
 * a 3-radius badge embedded inside a host icon (eight teeth + one
 * `r=3` hub circle, positioned at a host-specific centre).
 *
 * Tier 2 subject — a real-world gear rotates. The motion is a single
 * eased 0→360° revolution per cycle. Every cog element (teeth + hub
 * circle, in either form) animates the same `rotate` keyframes around
 * the cog's centre.
 *
 * Per-variant `transformOrigin` (resolved in user-units against the
 * engine's view-box `transformBox`) is set inside the factory so each
 * composite can pin the rotation to its own cog centre without
 * disturbing the host's transform pivot. Looked up from
 * `COG_CENTERS` by `ctx.iconName`; defaults to icon centre for
 * standalone `cog` or any unknown variant.
 *
 * Place this FIRST in the compose list — ahead of any family
 * modifier-reveal — so the cog teeth and hub are claimed by their
 * rotation before the family wildcard would grab them as a draw-in
 * marker.
 *
 * Coverage today: standalone `cog`, plus the three composite cogs
 * whose families are already signed (`cloud-cog`, `wifi-cog`,
 * `monitor-cog`). Other composite cogs (`calendar-cog`, `file-cog`,
 * `folder-cog`, `brain-cog`, `server-cog`, `user-cog`,
 * `user-round-cog`, `shield-cog`, `shield-cog-corner`,
 * `columns-3-cog`) get added to `COG_CENTERS` + the d-list as their
 * families are signed.
 */

/**
 * Per-iconName centre of rotation. Add a row when authoring a new
 * cog-bearing composite.
 */
const COG_CENTERS: Record<string, [number, number]> = {
  cog: [12, 12],
  "cloud-cog": [12, 17],
  "wifi-cog": [18, 18],
  "monitor-cog": [18, 6],
  "calendar-cog": [18, 18],
  "file-cog": [7, 18],
};

/**
 * Every `d` string Lucide uses to draw cog teeth (or, for cloud-cog,
 * the two merged hub-arc + tooth strokes that combine the hub with
 * two of its teeth into a single path).
 */
const COG_TOOTH_DS = new Set<string>([
  // Standalone `cog` — twelve teeth around (12, 12).
  "M11 10.27 7 3.34",
  "m11 13.73-4 6.93",
  "M12 22v-2",
  "M12 2v2",
  "M14 12h8",
  "m17 20.66-1-1.73",
  "m17 3.34-1 1.73",
  "M2 12h2",
  "m20.66 17-1.73-1",
  "m20.66 7-1.73 1",
  "m3.34 17 1.73-1",
  "m3.34 7 1.73 1",

  // Composite cog at (12, 17) — cloud-cog. Six plain teeth + two
  // merged hub-arc + tooth strokes (cloud body covers part of the hub
  // so Lucide collapsed it into the teeth strokes).
  "m10.852 19.772-.383.924",
  "m13.148 14.228.383-.923",
  "M13.148 19.772a3 3 0 1 0-2.296-5.544l-.383-.923",
  "m13.53 20.696-.382-.924a3 3 0 1 1-2.296-5.544",
  "m14.772 15.852.923-.383",
  "m14.772 18.148.923.383",
  "m9.228 15.852-.923-.383",
  "m9.228 18.148-.923.383",

  // Composite cog at (18, 18) — wifi-cog (also used by folder-cog,
  // calendar-cog, columns-3-cog, user-round-cog — add to COG_CENTERS
  // when their families ship).
  "m14.305 19.53.923-.382",
  "m15.228 16.852-.923-.383",
  "m16.852 15.228-.383-.923",
  "m16.852 20.772-.383.924",
  "m19.148 15.228.383-.923",
  "m19.53 21.696-.382-.924",
  "m20.772 16.852.924-.383",
  "m20.772 19.148.924.383",

  // Composite cog at (18, 6) — monitor-cog.
  "m14.305 7.53.923-.382",
  "m15.228 4.852-.923-.383",
  "m16.852 3.228-.383-.924",
  "m16.852 8.772-.383.923",
  "m19.148 3.228.383-.924",
  "m19.53 9.696-.382-.924",
  "m20.772 4.852.924-.383",
  "m20.772 7.148.924.383",

  // Composite cog at (7, 18) — file-cog.
  "m3.305 19.53.923-.382",
  "m4.228 16.852-.924-.383",
  "m5.852 15.228-.383-.923",
  "m5.852 20.772-.383.924",
  "m8.148 15.228.383-.923",
  "m8.53 21.696-.382-.924",
  "m9.773 16.852.922-.383",
  "m9.773 19.148.922.383",

  // calendar-cog (cog at (18, 18) — most teeth match wifi-cog above,
  // but Lucide ships two unique tooth d's for this composite that
  // aren't in the wifi-cog set). Without these, those two teeth
  // stayed still while the other six rotated with the gear.
  "m15.228 19.148-.923.383",
  "m16.47 14.305.382.923",
]);

/**
 * Hub circles for cog centres listed in `COG_CENTERS`. Stored as a
 * Set of `"cx,cy,r"` strings so the matcher is O(1) and won't grab
 * unrelated `r=3` circles (notification dots, badge backgrounds).
 *
 * Standalone `cog` adds both its inner `r=2` and outer `r=8` circles;
 * cloud-cog has no separate hub circle (it's embedded in the merged
 * tooth strokes above).
 */
const COG_HUB_CIRCLES = new Set<string>([
  // Standalone `cog`
  "12,12,2",
  "12,12,8",
  // Composite hubs
  "18,18,3",
  "18,6,3",
  "7,18,3", // file-cog
]);

function matchesCogPath(ctx: ModeContext): boolean {
  if (ctx.pathTag === "path") {
    return COG_TOOTH_DS.has(String(ctx.pathAttrs.d));
  }
  if (ctx.pathTag === "circle") {
    const key = `${ctx.pathAttrs.cx},${ctx.pathAttrs.cy},${ctx.pathAttrs.r}`;
    return COG_HUB_CIRCLES.has(key);
  }
  return false;
}

export const cogGear: Motion = {
  matches: matchesCogPath,
  factory: (ctx) => {
    const [cx, cy] = COG_CENTERS[ctx.iconName] ?? [12, 12];
    const origin = `${cx}px ${cy}px`;
    return {
      rest: { rotate: 0, transformOrigin: origin },
      active: {
        rotate: [0, 360],
        transformOrigin: origin,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          ease: "easeInOut",
        },
      },
    };
  },
};
