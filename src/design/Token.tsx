import React from "react";
import { GRADIENT_BRAND, RADIUS } from "./tokens";

export type TokenProps = {
  size: number;
  rotation?: number;
  cornerRadius?: number;
  opacity?: number;
  glow?: number;
  style?: React.CSSProperties;
};

/**
 * The single recurring "token" swatch that is never replaced across the
 * video, only recomposed (multiplied, cloned, morphed into a node, re-formed
 * into the token again). A plain gradient div reads identically to a
 * @remotion/shapes Rect here but supports the 5-stop brand gradient without
 * hand-wiring an SVG <linearGradient>.
 */
export const Token: React.FC<TokenProps> = ({
  size,
  rotation = 0,
  cornerRadius = RADIUS.md,
  opacity = 1,
  glow = 0,
  style,
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: cornerRadius,
        background: GRADIENT_BRAND,
        opacity,
        transform: `rotate(${rotation}deg)`,
        boxShadow: glow > 0 ? `0 0 ${glow}px ${glow / 2}px rgba(105, 58, 244, ${0.35 * glow / 40})` : undefined,
        ...style,
      }}
    />
  );
};
