import { matchPathD, type Motion } from "../compose";

/**
 * The Lucide bell's clapper bob — the small curve at y≈21 that hangs below
 * the shell. Modeled as a shorter, free pendulum than the shell: larger
 * initial amplitude (22° vs the shell's 12°), more visible cycles, and one
 * extra small late wiggle so the clapper continues to oscillate briefly
 * after the shell has visually settled.
 *
 * Reused by every bell variant whose Lucide path data carries this exact
 * `d` string: `bell`, `bell-plus`, `bell-minus`, `bell-ring`, etc.
 */
const CLAPPER_D = "M10.268 21a2 2 0 0 0 3.464 0";

export const bellClapper: Motion = {
  matches: matchPathD(CLAPPER_D),
  factory: (ctx) => ({
    rest: { rotate: 0 },
    active: {
      rotate: [0, -22, 16, -11, 8, -5, 3, -2, 1, 0],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        times: [0, 0.1, 0.23, 0.36, 0.49, 0.62, 0.75, 0.87, 0.95, 1.0],
        ease: [
          "easeOut",
          "easeInOut",
          "easeInOut",
          "easeInOut",
          "easeInOut",
          "easeInOut",
          "easeInOut",
          "easeInOut",
          "easeInOut",
        ],
        repeat: ctx.repeat,
      },
    },
  }),
};
