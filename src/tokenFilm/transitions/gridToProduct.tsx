import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

type GridToProductProps = Record<string, never>;

// Shot3 -> Shot4. The token panel (right side of frame) collapses toward its
// own position; the real product page expands from that same right-anchored
// point — the mockup literally becomes the product.
const GridToProductPresentation: React.FC<TransitionPresentationComponentProps<GridToProductProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  if (presentationDirection === "exiting") {
    const scale = 1 - presentationProgress * 0.35;
    return (
      <AbsoluteFill style={{ transform: `scale(${scale})`, opacity: 1 - presentationProgress, transformOrigin: "68% 45%" }}>
        {children}
      </AbsoluteFill>
    );
  }

  const radius = presentationProgress * 120;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${radius}% at 68% 45%)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const gridToProduct = (props: GridToProductProps = {}): TransitionPresentation<GridToProductProps> => ({
  component: GridToProductPresentation,
  props,
});
