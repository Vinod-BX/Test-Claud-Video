import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

type ProductMultiplyProps = Record<string, never>;

// Shot4 -> Shot5. The single centered card shrinks toward where it will sit
// as the first card in the row; the family reveals outward from that same
// left-of-center point — shared-element continuity, not a generic wipe.
const ProductMultiplyPresentation: React.FC<TransitionPresentationComponentProps<ProductMultiplyProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  if (presentationDirection === "exiting") {
    const scale = 1 - presentationProgress * 0.25;
    const translateX = -presentationProgress * 180;
    return (
      <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${translateX}px)`, opacity: 1 - presentationProgress }}>
        {children}
      </AbsoluteFill>
    );
  }

  const width = presentationProgress * 140;
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 ${100 - width}% 0 0)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const productMultiply = (props: ProductMultiplyProps = {}): TransitionPresentation<ProductMultiplyProps> => ({
  component: ProductMultiplyPresentation,
  props,
});
