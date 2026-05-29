"use client";

import { Sparkles } from "lucide-motion";

/**
 * Live demo for the function-form `mode` prop on the modes docs page. Lives
 * in a `"use client"` component because RSC can't serialize a function prop
 * passed from server-rendered MDX directly to a client component.
 */
export function CustomModeExample() {
  return (
    <Sparkles
      size={64}
      mode={(ctx) => ({
        rest: { rotate: 0, scale: 1 },
        active: {
          rotate: [0, -15, 12, -8, 0],
          scale: [1, 1.1, 1],
          transition: {
            duration: ctx.duration,
            delay: ctx.delay + ctx.index * ctx.stagger,
            ease: ctx.easing,
            repeat: ctx.repeat,
          },
        },
      })}
      duration={0.6}
    />
  );
}
