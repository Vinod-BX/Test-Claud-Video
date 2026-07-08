import { TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, CalculateMetadataFunction } from "remotion";
import { getAllSceneDurationsInSeconds } from "./audio/scene-audio";
import { useNunitoSansLoaded } from "./design/fonts";
import { SCRIPT_SCENES, VIDEO_FPS } from "./design/tokens";
import { Scene1Opening } from "./scenes/Scene1Opening";
import { Scene2TheShift } from "./scenes/Scene2TheShift";
import { Scene3WhatThisEnables } from "./scenes/Scene3WhatThisEnables";
import { Scene4HowItWorks } from "./scenes/Scene4HowItWorks";
import { Scene5CrossPlatformGeneration } from "./scenes/Scene5CrossPlatformGeneration";
import { Scene6WhyThisMatters } from "./scenes/Scene6WhyThisMatters";
import { Scene7Closing } from "./scenes/Scene7Closing";
import { buildTransitionSeriesPlan, getTransitionTiming, TRANSITION_PLAN } from "./transitions/plan";

export type PortableDesignSystemProps = {
  sceneDurationsInFrames?: number[];
};

const FALLBACK_BASE_FRAMES = SCRIPT_SCENES.map((s) => Math.round(s.baseDurationInSeconds * VIDEO_FPS));
const FALLBACK_PLAN = buildTransitionSeriesPlan(FALLBACK_BASE_FRAMES);

export const calculateMetadata: CalculateMetadataFunction<PortableDesignSystemProps> = async ({ props }) => {
  const durations = await getAllSceneDurationsInSeconds();
  const baseFramesPerScene = SCRIPT_SCENES.map((scene) => Math.round(durations[scene.id] * VIDEO_FPS));
  const { sequenceDurationsInFrames, totalDurationInFrames } = buildTransitionSeriesPlan(baseFramesPerScene);

  return {
    durationInFrames: totalDurationInFrames,
    props: { ...props, sceneDurationsInFrames: sequenceDurationsInFrames },
  };
};

export const PortableDesignSystem: React.FC<PortableDesignSystemProps> = ({
  sceneDurationsInFrames = FALLBACK_PLAN.sequenceDurationsInFrames,
}) => {
  useNunitoSansLoaded();

  const [d1, d2, d3, d4, d5, d6, d7] = sceneDurationsInFrames;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={d1}>
          <Scene1Opening durationInFrames={d1} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[0].presentation} timing={getTransitionTiming(TRANSITION_PLAN[0].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d2}>
          <Scene2TheShift durationInFrames={d2} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[1].presentation} timing={getTransitionTiming(TRANSITION_PLAN[1].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d3}>
          <Scene3WhatThisEnables durationInFrames={d3} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[2].presentation} timing={getTransitionTiming(TRANSITION_PLAN[2].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d4}>
          <Scene4HowItWorks durationInFrames={d4} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[3].presentation} timing={getTransitionTiming(TRANSITION_PLAN[3].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d5}>
          <Scene5CrossPlatformGeneration durationInFrames={d5} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[4].presentation} timing={getTransitionTiming(TRANSITION_PLAN[4].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d6}>
          <Scene6WhyThisMatters durationInFrames={d6} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[5].presentation} timing={getTransitionTiming(TRANSITION_PLAN[5].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d7}>
          <Scene7Closing durationInFrames={d7} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
