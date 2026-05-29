import { matchPathD, type Motion } from "../compose";
import { CODE_SYMBOL_KEYFRAMES } from "./code-symbol";

/**
 * The forward slash `m14.5 4-5 16` between the two chevrons in
 * `code-xml`. Opacity dim phase-locked to `CODE_SYMBOL_KEYFRAMES`
 * so the slash dims as the brackets pinch — reads as the XML tag
 * being typed together.
 */
const CODE_XML_SLASH_D = "m14.5 4-5 16";

export const codeXmlSlash: Motion = {
  matches: matchPathD(CODE_XML_SLASH_D),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.5, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: CODE_SYMBOL_KEYFRAMES.times,
      },
    },
  }),
};
