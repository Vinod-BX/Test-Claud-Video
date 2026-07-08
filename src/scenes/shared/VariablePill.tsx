import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT_FAMILY, RADIUS } from "../../design/tokens";

export type VariablePillProps = {
  label: string;
  /** 0-1 reveal progress */
  progress: number;
  accent?: string;
  monospace?: boolean;
  fontSize?: number;
};

/** A small rounded label chip — token/variable names, tool names, stats. */
export const VariablePill: React.FC<VariablePillProps> = ({
  label,
  progress,
  accent = COLORS.deepViolet,
  monospace = false,
  fontSize = 22,
}) => {
  const scale = interpolate(progress, [0, 1], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${fontSize * 0.4}px ${fontSize * 0.85}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${accent}`,
        background: COLORS.white,
        color: COLORS.ink,
        fontFamily: monospace ? "monospace" : FONT_FAMILY,
        fontWeight: monospace ? 400 : 700,
        fontSize,
        transform: `scale(${scale})`,
        opacity,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};
