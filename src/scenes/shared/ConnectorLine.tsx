import { evolvePath } from "@remotion/paths";
import { Trail } from "@remotion/motion-blur";
import React, { useMemo } from "react";
import { COLORS } from "../../design/tokens";

export type ConnectorLineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** 0-1 draw-on progress */
  progress: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  /** wrap in a @remotion/motion-blur Trail for an "energy flowing" feel */
  trail?: boolean;
};

const ConnectorPath: React.FC<Pick<ConnectorLineProps, "x1" | "y1" | "x2" | "y2" | "progress" | "color" | "strokeWidth" | "dashed">> = ({
  x1,
  y1,
  x2,
  y2,
  progress,
  color = COLORS.deepViolet,
  strokeWidth = 3,
  dashed = false,
}) => {
  const d = useMemo(() => `M ${x1} ${y1} L ${x2} ${y2}`, [x1, y1, x2, y2]);
  const { strokeDasharray, strokeDashoffset } = useMemo(() => evolvePath(progress, d), [progress, d]);

  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? `10 8` : strokeDasharray}
        strokeDashoffset={dashed ? undefined : strokeDashoffset}
        opacity={dashed ? progress : 1}
      />
    </svg>
  );
};

/** A drawn-on connector between two points, tying components together as
 * "energy flow" (Scene 3's React/Flutter/Web fan-out, Scene 6's lattice beams). */
export const ConnectorLine: React.FC<ConnectorLineProps> = ({ trail, ...props }) => {
  if (trail) {
    return (
      <Trail layers={4} lagInFrames={2} trailOpacity={0.35}>
        <ConnectorPath {...props} />
      </Trail>
    );
  }
  return <ConnectorPath {...props} />;
};
