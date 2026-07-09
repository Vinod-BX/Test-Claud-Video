import type { TransitionPresentation } from "@remotion/transitions";
import { linearTiming } from "@remotion/transitions";
import { ShotId } from "./tokens";
import { dotConverge } from "./transitions/dotConverge";
import { gridToProduct } from "./transitions/gridToProduct";
import { productMultiply } from "./transitions/productMultiply";
import { tokenExpand } from "./transitions/tokenExpand";

export type TransitionPlanEntry = {
  between: [ShotId, ShotId];
  presentation: TransitionPresentation<Record<string, never>>;
  durationInFrames: number;
};

// One bespoke transition per cut, each tied to the specific object/position
// shared by the two adjoining shots — no bare fade()/slide()/wipe().
export const TRANSITION_PLAN: TransitionPlanEntry[] = [
  { between: ["shot1DotField", "shot2Selection"], presentation: dotConverge(), durationInFrames: 18 },
  { between: ["shot2Selection", "shot3TokenPanel"], presentation: tokenExpand(), durationInFrames: 20 },
  { between: ["shot3TokenPanel", "shot4ProductPage"], presentation: gridToProduct(), durationInFrames: 20 },
  { between: ["shot4ProductPage", "shot5ProductFamily"], presentation: productMultiply(), durationInFrames: 18 },
];

export const getTransitionTiming = (durationInFrames: number) => linearTiming({ durationInFrames });

/**
 * Pads each shot's base duration by half of each adjoining transition's
 * length so the transition's midpoint lands on the shot's own tempo-grid
 * timestamp, then returns the exact total after TransitionSeries' overlap
 * subtraction.
 */
export const buildTransitionSeriesPlan = (baseFramesPerShot: number[]) => {
  if (baseFramesPerShot.length !== TRANSITION_PLAN.length + 1) {
    throw new Error(`Expected ${TRANSITION_PLAN.length + 1} shots for ${TRANSITION_PLAN.length} transitions, got ${baseFramesPerShot.length}`);
  }

  const sequenceDurationsInFrames = baseFramesPerShot.map((base, index) => {
    const before = index > 0 ? TRANSITION_PLAN[index - 1].durationInFrames / 2 : 0;
    const after = index < TRANSITION_PLAN.length ? TRANSITION_PLAN[index].durationInFrames / 2 : 0;
    return Math.round(base + before + after);
  });

  const totalTransitionFrames = TRANSITION_PLAN.reduce((sum, t) => sum + t.durationInFrames, 0);
  const totalDurationInFrames = sequenceDurationsInFrames.reduce((sum, d) => sum + d, 0) - totalTransitionFrames;

  return { sequenceDurationsInFrames, totalDurationInFrames };
};
