import { evolvePath } from "@remotion/paths";
import { makeRect } from "@remotion/shapes";
import React, { useMemo } from "react";
import { COLORS, RADIUS } from "./tokens";

export type ScreenCardProps = {
  width: number;
  height: number;
  x: number;
  y: number;
  rotation?: number;
  accent?: string;
  opacity?: number;
  /** 0 = not drawn yet, 1 = fully drawn stroke outline. Omit for a solid border. */
  drawProgress?: number;
  filterBlurPx?: number;
  children?: React.ReactNode;
};

/**
 * A "product screen" wireframe card — the recurring duplication/reconfiguration
 * object shared verbatim (same positions) between Scene 1 and Scene 7 via
 * sceneGridLayout.ts, so the loop point matches exactly.
 */
export const ScreenCard: React.FC<ScreenCardProps> = ({
  width,
  height,
  x,
  y,
  rotation = 0,
  accent = COLORS.deepViolet,
  opacity = 1,
  drawProgress,
  filterBlurPx = 0,
  children,
}) => {
  const rectPath = useMemo(() => makeRect({ width: width - 3, height: height - 3, cornerRadius: RADIUS.md }).path, [width, height]);

  const drawStyle = useMemo(() => {
    if (drawProgress === undefined) {
      return null;
    }
    return evolvePath(drawProgress, rectPath);
  }, [drawProgress, rectPath]);

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        opacity,
        filter: filterBlurPx > 0 ? `blur(${filterBlurPx}px)` : undefined,
      }}
    >
      {drawStyle ? (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path
            d={rectPath}
            transform="translate(1.5, 1.5)"
            fill="none"
            stroke={accent}
            strokeWidth={3}
            strokeDasharray={drawStyle.strokeDasharray}
            strokeDashoffset={drawStyle.strokeDashoffset}
          />
        </svg>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: RADIUS.md,
            background: COLORS.white,
            border: `3px solid ${accent}`,
            boxShadow: "0 18px 40px rgba(11, 17, 28, 0.08)",
          }}
        />
      )}
      {children}
    </div>
  );
};
