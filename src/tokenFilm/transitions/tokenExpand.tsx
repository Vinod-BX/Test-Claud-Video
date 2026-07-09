import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

type TokenExpandProps = Record<string, never>;

// Shot2 -> Shot3. The selected token (screen center) zooms toward the token
// panel's top-left origin, where the category list begins in Shot3.
const TokenExpandPresentation: React.FC<TransitionPresentationComponentProps<TokenExpandProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  if (presentationDirection === "exiting") {
    const scale = 1 + presentationProgress * 0.5;
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          opacity: 1 - presentationProgress,
          transformOrigin: "50% 48%",
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  const inset = (1 - presentationProgress) * 46;
  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(${inset}% ${inset * 1.3}% ${inset}% ${inset * 0.4}% round ${(1 - presentationProgress) * 40}px)`,
        opacity: Math.min(1, presentationProgress * 1.6),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const tokenExpand = (props: TokenExpandProps = {}): TransitionPresentation<TokenExpandProps> => ({
  component: TokenExpandPresentation,
  props,
});
