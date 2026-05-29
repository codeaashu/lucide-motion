import { matchAnyPath, type Motion } from "../compose";

/**
 * The `fire-extinguisher` icon — a tool, not actual fire. Lucide
 * draws it with six paths (canister body, hose curve, handle,
 * strap, top cap, nozzle) and the family-status grouping calls
 * this the entire `fire` family for the project's purposes.
 *
 * **Real-life motion**: a fire extinguisher hanging on a wall
 * doesn't visibly move. Animating it as a flame would misrepresent
 * what it is. Modeled here as a subtle two-pulse scale contraction
 * + opacity dim across the whole device — a soft "device armed"
 * heartbeat rather than flame physics. Reads as the extinguisher
 * being alive on its bracket, ready to deploy.
 *
 * Uses `matchAnyPath` because every part of the device shares the
 * same gentle pulse. Place this in a signature that has no other
 * specific motions.
 */
export const fireExtinguisherReady: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.97, 1, 0.98, 1],
      opacity: [1, 0.85, 1, 0.92, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: ctx.repeat,
      },
    },
  }),
};
