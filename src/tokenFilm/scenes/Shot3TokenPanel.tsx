import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { sliceTextByProgress } from "../../design/textReveal";
import { CHIP, FONT_FAMILY, HAIRLINE, INK, MUTED } from "../tokens";

const HEADLINE = "The tokens define the structure.";

const CATEGORIES = [
  { name: "Color", accent: CHIP.blue },
  { name: "Typography", accent: CHIP.purple },
  { name: "Spacing", accent: CHIP.teal },
  { name: "Grid", accent: CHIP.orange },
  { name: "Radius", accent: CHIP.pink },
  { name: "Elevation", accent: CHIP.sky },
] as const;

const PANEL_X = 1120;
const PANEL_Y = 210;
const PANEL_W = 640;
const PANEL_H = 660;
const COLS = 9;

/**
 * Beat 3 — the token list on the left literally drives the mockup on the
 * right: whichever category is "active" is the one property changing on the
 * panel at that moment (color swap, type sample, gap breathing, column
 * draw-on, corner rounding, shadow depth). The panel's own construction is
 * the background motion — nothing decorative bolted on separately.
 */
export const Shot3TokenPanel: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const introEnd = 0.08;
  const cycleProgress = interpolate(progress, [introEnd, 0.92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const activeIndexFloat = cycleProgress * CATEGORIES.length;
  const activeIndex = Math.min(CATEGORIES.length - 1, Math.floor(activeIndexFloat));

  const headlineProgress = interpolate(progress, [0.02, 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closeHeadlineProgress = interpolate(progress, [0.94, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const gridDraw = interpolate(activeIndexFloat, [3, 3.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gridSustain = activeIndexFloat > 3 ? Math.max(gridDraw, 1) : gridDraw;
  const radiusAmount = interpolate(activeIndexFloat, [4, 4.6], [0, 28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const radiusSustain = activeIndexFloat > 4 ? 28 : radiusAmount;
  const elevationAmount = interpolate(activeIndexFloat, [5, 5.6], [0.06, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spacingAmount = interpolate(activeIndexFloat, [2, 2.6], [10, 26], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spacingSustain = activeIndexFloat > 2.6 ? 26 : spacingAmount;
  const typeAmount = interpolate(activeIndexFloat, [1, 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const typeSustain = activeIndexFloat > 1.6 ? 1 : typeAmount;
  const colorAmount = interpolate(activeIndexFloat, [0, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const barColor = colorAmount > 0 ? CATEGORIES[0].accent : "#D8DAE2";

  const cols = useMemo(() => Array.from({ length: COLS }), []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      {headlineProgress > 0 && (
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 96,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 56,
            color: INK,
            maxWidth: 760,
          }}
        >
          {sliceTextByProgress(HEADLINE, headlineProgress)}
        </div>
      )}

      {/* Left: token category list */}
      <div style={{ position: "absolute", left: 96, top: 300, display: "flex", flexDirection: "column", gap: 30 }}>
        {CATEGORIES.map((cat, i) => {
          const rowIn = interpolate(progress, [0.05 + i * 0.02, 0.12 + i * 0.02], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const isActive = i === activeIndex;
          if (rowIn <= 0) return null;
          return (
            <div
              key={cat.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: rowIn,
                transform: `translateX(${(1 - rowIn) * -24}px)`,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 5,
                  background: cat.accent,
                  opacity: isActive ? 1 : 0.35,
                  boxShadow: isActive ? `0 0 20px ${cat.accent}77` : undefined,
                  transform: `scale(${isActive ? 1.15 : 1})`,
                }}
              />
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: isActive ? 800 : 600,
                  fontSize: 38,
                  color: isActive ? INK : MUTED,
                }}
              >
                {cat.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: the mockup panel the tokens are building */}
      <div
        style={{
          position: "absolute",
          left: PANEL_X,
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          borderRadius: radiusSustain,
          background: "#FFFFFF",
          border: `1px solid ${HAIRLINE}`,
          boxShadow: `0 30px 80px rgba(11,15,26,${elevationAmount})`,
          overflow: "hidden",
        }}
      >
        <div style={{ height: 64, background: barColor, opacity: 0.9 }} />

        <div style={{ padding: spacingSustain, display: "flex", flexDirection: "column", gap: spacingSustain }}>
          {typeSustain > 0 && (
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: 30 + typeSustain * 8,
                color: INK,
                opacity: typeSustain,
              }}
            >
              Aa — {FONT_FAMILY}
            </div>
          )}

          <div style={{ position: "relative", height: 260 }}>
            {cols.map((_, i) => {
              const colDraw = interpolate(gridSustain, [i / COLS, i / COLS + 0.12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              if (colDraw <= 0) return null;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: (i * (PANEL_W - spacingSustain * 2)) / COLS,
                    top: 0,
                    width: (PANEL_W - spacingSustain * 2) / COLS - 6,
                    height: 260 * colDraw,
                    borderRadius: 4,
                    background: "#EEF0F4",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {closeHeadlineProgress > 0 && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 100 }}>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 34,
              color: MUTED,
              opacity: closeHeadlineProgress,
            }}
          >
            Six tokens. One system.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
