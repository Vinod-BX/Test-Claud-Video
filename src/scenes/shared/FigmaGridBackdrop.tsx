import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../design/tokens";

export type FigmaGridBackdropProps = {
  /** 0-1, drives a continuous horizontal+vertical pan (never repeats its rate within a scene) */
  panProgress: number;
  opacity?: number;
  cellSize?: number;
};

/**
 * The Figma dot-grid motif — faint in Scene 1 (foreshadowing), prominent
 * with a slow continuous pan in Scene 4 ("we start in Figma"). Background
 * motion is content-tied, never decorative filler.
 */
export const FigmaGridBackdrop: React.FC<FigmaGridBackdropProps> = ({ panProgress, opacity = 0.05, cellSize = 48 }) => {
  const offset = panProgress * cellSize * 6;
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `radial-gradient(${COLORS.deepViolet} 1.5px, transparent 1.5px)`,
        backgroundSize: `${cellSize}px ${cellSize}px`,
        backgroundPosition: `${offset}px ${offset * 0.6}px`,
      }}
    />
  );
};
