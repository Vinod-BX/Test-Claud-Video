import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../design/tokens";

type StackDrawProps = Record<string, never>;

/**
 * S3 -> S4. A horizontal scan-line sweeps top-to-bottom, revealing Scene 4's
 * Figma canvas underneath it as it passes — the "blueprint" cut into the
 * technical scene, echoed by a thin bright line at the reveal edge.
 */
const StackDrawPresentation: React.FC<TransitionPresentationComponentProps<StackDrawProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const edge = presentationProgress * 100;

  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ clipPath: `inset(${edge}% 0 0 0)` }}>{children}</AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${100 - edge}% 0)` }}>{children}</AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${edge}%`,
          height: 3,
          background: COLORS.electricBlue,
          boxShadow: `0 0 24px 4px ${COLORS.electricBlue}`,
          opacity: presentationProgress > 0.02 && presentationProgress < 0.98 ? 0.85 : 0,
        }}
      />
    </AbsoluteFill>
  );
};

export const stackDraw = (props: StackDrawProps = {}): TransitionPresentation<StackDrawProps> => ({
  component: StackDrawPresentation,
  props,
});
