import { interpolatePath } from "@remotion/paths";
import { makeCircle, makeRect } from "@remotion/shapes";
import React, { useMemo } from "react";
import { BRAND_GRADIENT_STOPS } from "../../design/tokens";

export type NetworkNodeProps = {
  x: number;
  y: number;
  size: number;
  /** 0 = Token (rounded square), 1 = network node (circle) */
  morphProgress: number;
  opacity?: number;
};

/**
 * The Token, literally morphing into a lattice node and back — 0 is the
 * rounded-square Token shape, 1 is a circle. Same recurring gradient fill
 * throughout, only the outline topology changes (Scene 6 forming the
 * network, Scene 7 contracting back).
 */
export const NetworkNode: React.FC<NetworkNodeProps> = ({ x, y, size, morphProgress, opacity = 1 }) => {
  const tokenPath = useMemo(() => makeRect({ width: size, height: size, cornerRadius: size * 0.28 }).path, [size]);
  const circlePath = useMemo(() => makeCircle({ radius: size / 2 }).path, [size]);
  const d = useMemo(
    () => interpolatePath(morphProgress, tokenPath, circlePath),
    [morphProgress, tokenPath, circlePath],
  );

  return (
    <svg
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        overflow: "visible",
        opacity,
      }}
      width={size}
      height={size}
    >
      <defs>
        <linearGradient id={`network-node-gradient-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="100%">
          {BRAND_GRADIENT_STOPS.map((color, index) => (
            <stop key={color} offset={`${(index / (BRAND_GRADIENT_STOPS.length - 1)) * 100}%`} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#network-node-gradient-${x}-${y})`} />
    </svg>
  );
};
