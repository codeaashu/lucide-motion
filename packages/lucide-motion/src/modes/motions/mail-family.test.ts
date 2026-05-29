import { beforeEach, describe, expect, it, vi } from "vitest";
import { __resetComposeWarnings } from "../compose";
import type { Mode, ModeContext } from "../types";
import mail from "../signatures/mail";
import mailCheck from "../signatures/mail-check";
import mailMinus from "../signatures/mail-minus";
import mailOpen from "../signatures/mail-open";
import mailPlus from "../signatures/mail-plus";
import mailQuestionMark from "../signatures/mail-question-mark";
import mailSearch from "../signatures/mail-search";
import mailWarning from "../signatures/mail-warning";
import mailX from "../signatures/mail-x";

type TestNode = [tag: string, attrs: Record<string, string | number>];

const variants: Array<{
  iconName: string;
  signature: Mode;
  nodes: TestNode[];
}> = [
  {
    iconName: "mail",
    signature: mail,
    nodes: [
      ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }],
      ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }],
    ],
  },
  {
    iconName: "mail-open",
    signature: mailOpen,
    nodes: [
      [
        "path",
        {
          d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
        },
      ],
      ["path", { d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" }],
    ],
  },
  {
    iconName: "mail-plus",
    signature: mailPlus,
    nodes: [
      ["path", { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" }],
      ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
      ["path", { d: "M19 16v6" }],
      ["path", { d: "M16 19h6" }],
    ],
  },
  {
    iconName: "mail-minus",
    signature: mailMinus,
    nodes: [
      ["path", { d: "M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" }],
      ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
      ["path", { d: "M16 19h6" }],
    ],
  },
  {
    iconName: "mail-check",
    signature: mailCheck,
    nodes: [
      ["path", { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" }],
      ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
      ["path", { d: "m16 19 2 2 4-4" }],
    ],
  },
  {
    iconName: "mail-x",
    signature: mailX,
    nodes: [
      ["path", { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" }],
      ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
      ["path", { d: "m17 17 4 4" }],
      ["path", { d: "m21 17-4 4" }],
    ],
  },
  {
    iconName: "mail-warning",
    signature: mailWarning,
    nodes: [
      ["path", { d: "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" }],
      ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
      ["path", { d: "M20 14v4" }],
      ["path", { d: "M20 22v.01" }],
    ],
  },
  {
    iconName: "mail-question-mark",
    signature: mailQuestionMark,
    nodes: [
      ["path", { d: "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" }],
      ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
      ["path", { d: "M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2" }],
      ["path", { d: "M20 22v.01" }],
    ],
  },
  {
    iconName: "mail-search",
    signature: mailSearch,
    nodes: [
      ["path", { d: "M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5" }],
      ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
      ["path", { d: "M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" }],
      ["circle", { cx: "18", cy: "18", r: "3" }],
      ["path", { d: "m22 22-1.5-1.5" }],
    ],
  },
];

function ctx(iconName: string, index: number, [pathTag, pathAttrs]: TestNode): ModeContext {
  return {
    iconName,
    index,
    pathTag,
    pathAttrs,
    duration: 1,
    delay: 0,
    stagger: 0,
    easing: "easeInOut",
    repeat: 0,
    pathLength: 100,
  };
}

describe("mail family signatures", () => {
  beforeEach(() => {
    __resetComposeWarnings();
  });

  it("matches every node without falling back to draw", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    for (const variant of variants) {
      variant.nodes.forEach((node, index) => {
        const resolved = variant.signature.factory(
          ctx(variant.iconName, index, node)
        );
        // Draw mode's fingerprint is `strokeDasharray` on the active variant.
        // A bespoke family motion must produce its own transforms, not the
        // default dash sweep.
        expect(
          "strokeDasharray" in (resolved.active as Record<string, unknown>)
        ).toBe(false);
      });
    }

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
