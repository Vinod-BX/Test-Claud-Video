import { Easing, interpolate } from "remotion";

/** Deterministic PRNG (mulberry32) — used only for fixed, seeded layout data
 * computed once at module scope, never per-frame, so renders stay identical
 * across worker processes. */
export const seededRandom = (seed: number): (() => number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** 0 -> 1 -> 0 visibility envelope for a shot layer, with independent
 * ease-in / ease-out fade windows so shots crossfade instead of cutting. */
export const shotEnvelope = (
  frame: number,
  activeStart: number,
  activeEnd: number,
  fadeIn: number,
  fadeOut: number,
): number => {
  const rising = interpolate(frame, [activeStart - fadeIn, activeStart], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const falling = interpolate(frame, [activeEnd, activeEnd + fadeOut], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return Math.min(rising, falling);
};

/** A "soft magnetic snap" entrance — content-tied UI elements fading/scaling
 * into position, per the art-direction brief's "no basic fades" rule this is
 * always composed with a scale/translate, never used as a bare opacity. */
export const enterProgress = (progress: number, start: number, end: number): number =>
  interpolate(progress, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
