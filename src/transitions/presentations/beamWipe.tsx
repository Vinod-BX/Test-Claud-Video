import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { GRADIENT_BRAND } from "../../design/tokens";

type BeamWipeProps = Record<string, never>;

/**
 * S5 -> S6. A diagonal brand-gradient beam sweeps across the frame — the
 * "generation" pipelines of Scene 5 collapsing into the single beam that
 * lights up Scene 6's network. Same edge-based bounding as patternSplit: a
 * scene sits at its resting progress (0 exiting / 1 entering) for nearly
 * all of its runtime, so both ends must stay within the valid clip-path range.
 */
const BeamWipePresentation: React.FC<TransitionPresentationComponentProps<BeamWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const edge = 100 - presentationProgress * 100;

  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ clipPath: `polygon(0 0, ${edge}% 0, ${edge - 18}% 100%, 0 100%)` }}>
        {children}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${edge}% 0, 100% 0, 100% 100%, ${edge - 18}% 100%)` }}>
        {children}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: -50,
          bottom: -50,
          left: `${edge - 19}%`,
          width: 26,
          background: GRADIENT_BRAND,
          transform: "skewX(-11deg)",
          filter: "blur(1px)",
          opacity: presentationProgress > 0.02 && presentationProgress < 0.98 ? 0.9 : 0,
        }}
      />
    </AbsoluteFill>
  );
};

export const beamWipe = (props: BeamWipeProps = {}): TransitionPresentation<BeamWipeProps> => ({
  component: BeamWipePresentation,
  props,
});
