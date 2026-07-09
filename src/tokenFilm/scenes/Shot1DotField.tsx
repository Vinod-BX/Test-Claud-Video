import { noise2D } from "@remotion/noise";
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { sliceTextByProgress } from "../../design/textReveal";
import { CHIP, FILM_HEIGHT, FILM_WIDTH, FONT_FAMILY, HAIRLINE, INK } from "../tokens";

const HEADLINE = "Every product begins as a decision.";

const COLS = 26;
const ROWS = 16;
const CELL = 84;

/**
 * Beat 1 — an infinite perspective field of token "cells" receding to a
 * horizon. Two cells (blue, orange) already carry color while the rest stay
 * neutral: the system exists before any single product is built on it. The
 * floor itself is the background motion (slow perspective drift) — no
 * separate decorative layer.
 */
export const Shot1DotField: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const drift = interpolate(progress, [0, 1], [0, 1], { easing: Easing.linear });

  const heroIn = interpolate(progress, [0.08, 0.24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headlineProgress = interpolate(progress, [0.66, 0.92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heroCells = useMemo(
    () => [
      { col: 5, row: 8, color: CHIP.blue },
      { col: 20, row: 6, color: CHIP.orange },
    ],
    [],
  );

  const cells = useMemo(() => {
    const out: { col: number; row: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        out.push({ col: c, row: r });
      }
    }
    return out;
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 900, perspectiveOrigin: "50% 8%" }}>
        <div
          style={{
            position: "absolute",
            left: FILM_WIDTH / 2 - (COLS * CELL) / 2,
            top: FILM_HEIGHT * 0.32,
            width: COLS * CELL,
            height: ROWS * CELL,
            transform: `rotateX(62deg) translateY(${-drift * CELL * ROWS * 0.4}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {cells.map(({ col, row }) => {
            const n = noise2D(`s1-cell-${col}-${row}`, 0, 0);
            const isHero = heroCells.some((h) => h.col === col && h.row === row);
            if (isHero) return null;
            return (
              <div
                key={`${col}-${row}`}
                style={{
                  position: "absolute",
                  left: col * CELL,
                  top: row * CELL,
                  width: CELL - 14,
                  height: CELL - 14,
                  borderRadius: 6,
                  background: `rgba(11, 15, 26, ${0.05 + Math.abs(n) * 0.04})`,
                  opacity: 1 - row / (ROWS * 1.4),
                }}
              />
            );
          })}

          {heroCells.map((h, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: h.col * CELL,
                top: h.row * CELL,
                width: CELL - 14,
                height: CELL - 14,
                borderRadius: 6,
                background: h.color,
                opacity: heroIn,
                boxShadow: `0 0 ${28 * heroIn}px ${h.color}66`,
                transform: `scale(${0.7 + heroIn * 0.3})`,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(255,255,255,0) 55%, rgba(255,255,255,0.94) 92%)` }} />

      <div
        style={{
          position: "absolute",
          top: 64,
          left: 96,
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: INK,
          opacity: 0.5,
          borderBottom: `2px solid ${HAIRLINE}`,
          paddingBottom: 10,
        }}
      >
        Design Token System
      </div>

      {headlineProgress > 0 && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150 }}>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: 96,
              color: INK,
              textAlign: "center",
              maxWidth: 1500,
              letterSpacing: "-0.01em",
            }}
          >
            {sliceTextByProgress(HEADLINE, headlineProgress)}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
