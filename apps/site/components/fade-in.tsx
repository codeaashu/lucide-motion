"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT_SOFT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type CommonProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
};

function buildTransition(
  duration: number,
  delay: number,
  reduced: boolean | null,
): Transition {
  return {
    duration: reduced ? 0 : duration,
    delay: reduced ? 0 : delay,
    ease: EASE_OUT_SOFT,
  };
}

/** One-shot entrance on mount. Use for above-the-fold content. */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.85,
  y = 6,
  className,
}: CommonProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={{ opacity: 1, y: 0 }}
      transition={buildTransition(duration, delay, reduced)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Plays once when the element scrolls into view. Use for below-the-fold sections. */
export function FadeInView({
  children,
  delay = 0,
  duration = 0.9,
  y = 10,
  className,
}: CommonProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={buildTransition(duration, delay, reduced)}
      className={className}
    >
      {children}
    </motion.div>
  );
}
