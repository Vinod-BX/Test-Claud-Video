import React from "react";
import { Easing, interpolate } from "remotion";
import { GREY, RADIUS, WHITE } from "../tokens";

export type StructureGridProps = {
  /** 0-1 — columns grow outward from the center, header bar draws in first. */
  progress: number;
  width: number;
  height: number;
  columns?: number;
  style?: React.CSSProperties;
};

/**
 * The layout skeleton (baseline grid + columns) growing from the token in
 * Shot 03 — structure arriving before any real interface content does.
 */
export const StructureGrid: React.FC<StructureGridProps> = ({ progress, width, height, columns = 6, style }) => {
  const headerReveal = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const center = (columns - 1) / 2;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: RADIUS.xl,
        background: WHITE,
        boxShadow: "0 40px 80px rgba(20, 22, 26, 0.08)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          right: 24,
          height: 34,
          borderRadius: RADIUS.sm,
          background: GREY[150],
          transform: `scaleX(${headerReveal})`,
          transformOrigin: "0% 50%",
          opacity: headerReveal,
        }}
      />

      <div style={{ position: "absolute", top: 84, bottom: 24, left: 24, right: 24, display: "flex", gap: 10 }}>
        {Array.from({ length: columns }).map((_, i) => {
          const distanceFromCenter = Math.abs(i - center) / center;
          const start = distanceFromCenter * 0.45;
          const local = interpolate(progress, [start, start + 0.4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: "100%",
                borderRadius: RADIUS.sm,
                background: i % 2 === 0 ? GREY[50] : WHITE,
                border: `1px solid ${GREY[150]}`,
                transform: `scaleY(${local})`,
                transformOrigin: "50% 0%",
                opacity: local,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
