import { TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { useNunitoSansLoaded } from "../design/fonts";
import { buildTransitionSeriesPlan, getTransitionTiming, TRANSITION_PLAN } from "./plan";
import { Shot1DotField } from "./scenes/Shot1DotField";
import { Shot2Selection } from "./scenes/Shot2Selection";
import { Shot3TokenPanel } from "./scenes/Shot3TokenPanel";
import { Shot4ProductPage } from "./scenes/Shot4ProductPage";
import { Shot5ProductFamily } from "./scenes/Shot5ProductFamily";
import { FILM_FPS, FILM_SHOTS } from "./tokens";

// No voiceover for this film — music-only, paced to a fixed tempo grid — so
// durations are static (unlike PortableDesignSystem's audio-driven
// calculateMetadata) and can be computed once at module scope.
const BASE_FRAMES = FILM_SHOTS.map((s) => Math.round(s.durationInSeconds * FILM_FPS));
export const TOKEN_FILM_PLAN = buildTransitionSeriesPlan(BASE_FRAMES);

export const TokenSystemFilm: React.FC = () => {
  useNunitoSansLoaded();

  const [d1, d2, d3, d4, d5] = TOKEN_FILM_PLAN.sequenceDurationsInFrames;

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={d1}>
          <Shot1DotField durationInFrames={d1} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[0].presentation} timing={getTransitionTiming(TRANSITION_PLAN[0].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d2}>
          <Shot2Selection durationInFrames={d2} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[1].presentation} timing={getTransitionTiming(TRANSITION_PLAN[1].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d3}>
          <Shot3TokenPanel durationInFrames={d3} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[2].presentation} timing={getTransitionTiming(TRANSITION_PLAN[2].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d4}>
          <Shot4ProductPage durationInFrames={d4} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={TRANSITION_PLAN[3].presentation} timing={getTransitionTiming(TRANSITION_PLAN[3].durationInFrames)} />

        <TransitionSeries.Sequence durationInFrames={d5}>
          <Shot5ProductFamily durationInFrames={d5} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
