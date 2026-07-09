import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { CHIP } from "../tokens";

type DotConvergeProps = Record<string, never>;

// Shot1 -> Shot2. The perspective field's hero cell (blue) is exactly where
// the flat grid's selection lands — the outgoing field collapses to that
// point, the incoming selection grid expands from it.
const DotConvergePresentation: React.FC<TransitionPresentationComponentProps<DotConvergeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  if (presentationDirection === "exiting") {
    const scale = 1 - presentationProgress * 0.6;
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity: 1 - presentationProgress, transformOrigin: "38% 55%" }}>
        {children}
      </AbsoluteFill>
    );
  }

  const radius = presentationProgress * 90;
  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${radius}% at 50% 48%)`,
        boxShadow: `inset 0 0 0 9999px rgba(255,255,255,${(1 - presentationProgress) * 0.4})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const dotConverge = (props: DotConvergeProps = {}): TransitionPresentation<DotConvergeProps> => ({
  component: DotConvergePresentation,
  props,
});

// Referenced for the shared glow tint at the seam.
export const DOT_CONVERGE_ACCENT = CHIP.blue;
