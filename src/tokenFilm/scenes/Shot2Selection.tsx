import { noise2D } from "@remotion/noise";
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { sliceTextByProgress } from "../../design/textReveal";
import { CHIP_ORDER, FILM_HEIGHT, FILM_WIDTH, FONT_FAMILY, INK } from "../tokens";

const HEADLINE = "One becomes the standard.";
const CENTER_X = FILM_WIDTH * 0.5;
const CENTER_Y = FILM_HEIGHT * 0.48;
const CHIP_SIZE = 40;

// Scattered candidate tokens, one of which will be selected. Positions are
// hand-placed (not random) so the composition reads clean at every frame.
const SCATTER = [
  { dx: -490, dy: -300, color: CHIP_ORDER[6] },
  { dx: -140, dy: -320, color: CHIP_ORDER[3] },
  { dx: 480, dy: -260, color: CHIP_ORDER[4] },
  { dx: -510, dy: -70, color: CHIP_ORDER[1] },
  { dx: 520, dy: -20, color: CHIP_ORDER[5] },
  { dx: -680, dy: 130, color: CHIP_ORDER[2] },
  { dx: -220, dy: 190, color: CHIP_ORDER[0] },
  { dx: 110, dy: 220, color: CHIP_ORDER[4] },
  { dx: 640, dy: 190, color: CHIP_ORDER[1] },
  { dx: 340, dy: 260, color: CHIP_ORDER[7] },
  { dx: -100, dy: 320, color: CHIP_ORDER[3] },
];

/**
 * Beat 2 — the field settles into a flat plan view. Every candidate token
 * drifts gently (organic, not decorative — this is the "unsettled options"
 * the video is about to resolve); the center token locks into focus with the
 * one deliberate spring snap, per the physics-vs-deliberate-motion rule.
 */
export const Shot2Selection: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = frame / durationInFrames;

  const lockFrame = 0.22 * durationInFrames;
  const lockSpring = spring({ frame: frame - lockFrame, fps, config: { damping: 13, mass: 0.7 } });

  const bracketOpacity = interpolate(progress, [0.2, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scatterFade = interpolate(progress, [0.3, 0.55], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineProgress = interpolate(progress, [0.62, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage: `radial-gradient(${INK} 1.5px, transparent 1.5px)`,
          backgroundSize: "44px 44px",
        }}
      />

      {SCATTER.map((s, i) => {
        const nx = noise2D(`s2-x-${i}`, frame * 0.01, 0) * 22;
        const ny = noise2D(`s2-y-${i}`, frame * 0.01, 10) * 22;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CENTER_X + s.dx + nx - CHIP_SIZE / 2,
              top: CENTER_Y + s.dy + ny - CHIP_SIZE / 2,
              width: CHIP_SIZE,
              height: CHIP_SIZE,
              borderRadius: 10,
              background: s.color,
              opacity: scatterFade,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: CENTER_X - 11 * lockSpring,
          top: CENTER_Y - 11 * lockSpring,
          width: 22 * lockSpring,
          height: 22 * lockSpring,
          borderRadius: 6,
          background: CHIP_ORDER[0],
          boxShadow: `0 0 ${40 * lockSpring}px ${CHIP_ORDER[0]}88`,
        }}
      />

      {bracketOpacity > 0 && (
        <div style={{ position: "absolute", left: CENTER_X - 100, top: CENTER_Y - 100, width: 200, height: 200, opacity: bracketOpacity }}>
          {[
            { top: 0, left: 0, borderTop: true, borderLeft: true },
            { top: 0, right: 0, borderTop: true, borderRight: true },
            { bottom: 0, left: 0, borderBottom: true, borderLeft: true },
            { bottom: 0, right: 0, borderBottom: true, borderRight: true },
          ].map((corner, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 34,
                height: 34,
                top: corner.top,
                left: corner.left,
                right: corner.right,
                bottom: corner.bottom,
                borderTop: corner.borderTop ? `4px solid ${CHIP_ORDER[0]}` : undefined,
                borderLeft: corner.borderLeft ? `4px solid ${CHIP_ORDER[0]}` : undefined,
                borderRight: corner.borderRight ? `4px solid ${CHIP_ORDER[0]}` : undefined,
                borderBottom: corner.borderBottom ? `4px solid ${CHIP_ORDER[0]}` : undefined,
                borderRadius: 6,
              }}
            />
          ))}
        </div>
      )}

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
