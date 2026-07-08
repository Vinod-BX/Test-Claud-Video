import type { TransitionPresentation } from "@remotion/transitions";
import { linearTiming } from "@remotion/transitions";
import { SceneId } from "../design/tokens";
import { apertureContract } from "./presentations/apertureContract";
import { beamWipe } from "./presentations/beamWipe";
import { patternSplit } from "./presentations/patternSplit";
import { stackDraw } from "./presentations/stackDraw";
import { tokenMorph } from "./presentations/tokenMorph";
import { tokenTiles } from "./presentations/tokenTiles";

export type TransitionPlanEntry = {
  /** the two scenes this transition sits between, for readability/QA only */
  between: [SceneId, SceneId];
  presentation: TransitionPresentation<Record<string, never>>;
  durationInFrames: number;
};

// One custom transition per cut, each tied to what the two adjoining scenes
// are about (see rules/art-direction.md — no bare fade()/slide()/wipe()).
export const TRANSITION_PLAN: TransitionPlanEntry[] = [
  { between: ["scene1Opening", "scene2TheShift"], presentation: tokenMorph(), durationInFrames: 24 },
  { between: ["scene2TheShift", "scene3WhatThisEnables"], presentation: patternSplit(), durationInFrames: 18 },
  { between: ["scene3WhatThisEnables", "scene4HowItWorks"], presentation: stackDraw(), durationInFrames: 20 },
  { between: ["scene4HowItWorks", "scene5CrossPlatformGeneration"], presentation: tokenTiles(), durationInFrames: 16 },
  { between: ["scene5CrossPlatformGeneration", "scene6WhyThisMatters"], presentation: beamWipe(), durationInFrames: 20 },
  { between: ["scene6WhyThisMatters", "scene7Closing"], presentation: apertureContract(), durationInFrames: 22 },
];

export const getTransitionTiming = (durationInFrames: number) => linearTiming({ durationInFrames });

export type TransitionSeriesPlan = {
  /** padded per-scene <TransitionSeries.Sequence> durations, in scene order */
  sequenceDurationsInFrames: number[];
  /** exact grand total after transition overlap is subtracted */
  totalDurationInFrames: number;
};

/**
 * Pads each scene's base duration by half of each adjoining transition's
 * length so the transition's midpoint lands on the scene's own script
 * timestamp, then returns the exact total after TransitionSeries' overlap
 * subtraction. Works identically whether baseFramesPerScene comes from the
 * script fallback or real per-scene voiceover durations (see calculateMetadata
 * in PortableDesignSystem.tsx).
 */
export const buildTransitionSeriesPlan = (
  baseFramesPerScene: number[],
  transitionPlan: TransitionPlanEntry[] = TRANSITION_PLAN,
): TransitionSeriesPlan => {
  if (baseFramesPerScene.length !== transitionPlan.length + 1) {
    throw new Error(
      `Expected ${transitionPlan.length + 1} scenes for ${transitionPlan.length} transitions, got ${baseFramesPerScene.length}`,
    );
  }

  const sequenceDurationsInFrames = baseFramesPerScene.map((base, index) => {
    const before = index > 0 ? transitionPlan[index - 1].durationInFrames / 2 : 0;
    const after = index < transitionPlan.length ? transitionPlan[index].durationInFrames / 2 : 0;
    return Math.round(base + before + after);
  });

  const totalTransitionFrames = transitionPlan.reduce((sum, t) => sum + t.durationInFrames, 0);
  const totalDurationInFrames =
    sequenceDurationsInFrames.reduce((sum, d) => sum + d, 0) - totalTransitionFrames;

  return { sequenceDurationsInFrames, totalDurationInFrames };
};
