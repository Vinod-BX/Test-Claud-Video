import React, { useMemo } from "react";
import { COLORS } from "../tokens";

export type GridHighlight = {
  col: number;
  row: number;
  progress: number;
  color: string;
};

export type GridFieldProps = {
  cols: number;
  rows: number;
  cellSize: number;
  /** 0-1, pans the whole field diagonally — the "camera glides over the surface" beat. */
  panProgress: number;
  /** 0 = flat frontal grid, 1 = full floor-like perspective tilt. */
  tiltProgress?: number;
  opacity?: number;
  highlights?: GridHighlight[];
};

// Deterministic per-cell shade so the floor reads as gently uneven (like a
// shaded 3D plane) without flickering frame to frame.
const shadeFor = (i: number): number => (Math.sin(i * 12.9898) * 43758.5453) % 1;

/**
 * The recurring "infinite construction grid" motif — a plane of tiny square
 * cells. Reused as the calm establishing surface (Shot 1), the faint
 * foundation beneath the assembling PDP (Shots 3-5), and the resting state
 * the whole scene collapses back into (Shot 6).
 */
export const GridField: React.FC<GridFieldProps> = ({
  cols,
  rows,
  cellSize,
  panProgress,
  tiltProgress = 0,
  opacity = 1,
  highlights = [],
}) => {
  const cells = useMemo(() => {
    const out: { col: number; row: number; shade: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        out.push({ col, row, shade: Math.abs(shadeFor(row * cols + col + 1)) });
      }
    }
    return out;
  }, [cols, rows]);

  const panX = panProgress * cellSize * 4;
  const panY = panProgress * cellSize * 2.2;
  const width = cols * cellSize;
  const height = rows * cellSize;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width,
        height,
        opacity,
        transform: `translate(-50%, -50%) perspective(2200px) rotateX(${tiltProgress * 52}deg) translate(${-panX}px, ${-panY}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {cells.map(({ col, row, shade }) => {
        const gap = cellSize * 0.16;
        return (
          <div
            key={`${col}-${row}`}
            style={{
              position: "absolute",
              left: col * cellSize + gap / 2,
              top: row * cellSize + gap / 2,
              width: cellSize - gap,
              height: cellSize - gap,
              borderRadius: cellSize * 0.14,
              background: COLORS.midnight,
              opacity: 0.05 + shade * 0.07,
            }}
          />
        );
      })}

      {highlights.map((h, i) => {
        if (h.progress <= 0) return null;
        const gap = cellSize * 0.16;
        const left = h.col * cellSize + gap / 2;
        const top = h.row * cellSize + gap / 2;
        const size = cellSize - gap;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top,
              width: size,
              height: size,
              borderRadius: cellSize * 0.14,
              background: h.color,
              opacity: h.progress,
              boxShadow: `0 0 ${28 * h.progress}px ${10 * h.progress}px ${h.color}55`,
            }}
          />
        );
      })}
    </div>
  );
};
