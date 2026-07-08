import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../design/tokens";

type ApertureContractProps = Record<string, never>;

/**
 * S6 -> S7. A hard-edged circular iris — mirrors the lattice-to-Token
 * contraction happening inside Scene 7 itself, so the transition mechanic
 * and the scene content say the same thing.
 */
const ApertureContractPresentation: React.FC<TransitionPresentationComponentProps<ApertureContractProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  if (presentationDirection === "exiting") {
    // 100% at rest (progress 0) so Scene 6 is fully visible for its whole
    // runtime, not just during the brief transition window.
    const radius = 100 - presentationProgress * 100;
    return (
      <AbsoluteFill style={{ clipPath: `circle(${radius}% at 50% 50%)` }}>
        {children}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: `inset 0 0 0 ${Math.max(0, 4 - presentationProgress * 4)}px ${COLORS.electricBlue}`,
            clipPath: `circle(${radius}% at 50% 50%)`,
          }}
        />
      </AbsoluteFill>
    );
  }

  // 100% once settled (progress 1) so Scene 7 is fully visible for its
  // whole runtime after the brief entering window.
  const radius = presentationProgress * 100;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${radius}% at 50% 50%)` }}>{children}</AbsoluteFill>
  );
};

export const apertureContract = (props: ApertureContractProps = {}): TransitionPresentation<ApertureContractProps> => ({
  component: ApertureContractPresentation,
  props,
});
