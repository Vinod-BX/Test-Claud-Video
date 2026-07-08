import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { GRADIENT_BRAND } from "../../design/tokens";

type PatternSplitProps = Record<string, never>;

/**
 * S2 -> S3. A diagonal fold sweeps across the frame carrying a bright
 * brand-gradient seam line at its leading edge — "the shift" cutting into
 * "what this enables". Diagonal clip-path, not a straight slide.
 *
 * `edge` runs 100 -> 0 as progress runs 0 -> 1, so the exiting scene is
 * fully visible at rest (progress 0, before any transition) and fully
 * covered once the cut completes; the entering scene is the exact mirror,
 * fully covered at rest (progress 0) and fully visible once settled
 * (progress 1) — both directions stay in the valid 0-100% clip-path range
 * at their resting values, since a scene sits at that resting value for
 * almost all of its runtime.
 */
const PatternSplitPresentation: React.FC<TransitionPresentationComponentProps<PatternSplitProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const edge = 100 - presentationProgress * 100;

  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ clipPath: `polygon(0% 0%, ${edge}% 0%, ${edge - 12}% 100%, 0% 100%)` }}>
        {children}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${edge}% 0%, 100% 0%, 100% 100%, ${edge - 12}% 100%)` }}>
        {children}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${edge - 12.5}%`,
          width: 6,
          background: GRADIENT_BRAND,
          transform: "skewX(-7deg)",
          opacity: presentationProgress > 0.02 && presentationProgress < 0.98 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};

export const patternSplit = (props: PatternSplitProps = {}): TransitionPresentation<PatternSplitProps> => ({
  component: PatternSplitPresentation,
  props,
});
