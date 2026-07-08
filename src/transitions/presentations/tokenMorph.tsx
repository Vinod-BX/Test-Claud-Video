import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

type TokenMorphProps = Record<string, never>;

/**
 * S1 -> S2. The outgoing scene collapses toward the center point (the exact
 * spot the Token will spring into); the incoming scene expands outward from
 * that same point. Custom-built for this cut, not a stock fade/slide.
 */
const TokenMorphPresentation: React.FC<TransitionPresentationComponentProps<TokenMorphProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  if (presentationDirection === "exiting") {
    const scale = 1 - presentationProgress * 0.45;
    const opacity = 1 - presentationProgress;
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity, transformOrigin: "50% 50%" }}>
        {children}
      </AbsoluteFill>
    );
  }

  // 100% comfortably covers the frame regardless of aspect ratio (CSS
  // resolves circle()'s percentage against the box's corner-normalized
  // diagonal, not the raw diagonal) — anything less leaves a permanent
  // corner-clip for the rest of the scene's runtime once progress settles at 1.
  const radius = presentationProgress * 100;
  const scale = 0.9 + presentationProgress * 0.1;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "50% 50%",
        clipPath: `circle(${radius}% at 50% 50%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const tokenMorph = (props: TokenMorphProps = {}): TransitionPresentation<TokenMorphProps> => ({
  component: TokenMorphPresentation,
  props,
});
