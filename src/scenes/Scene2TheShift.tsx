import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ScreenCard } from "../design/ScreenCard";
import { SCREEN_SLOTS } from "../design/sceneGridLayout";
import { Token } from "../design/Token";
import { COLORS, FONT_FAMILY, TYPE_SCALE, VIDEO_HEIGHT, VIDEO_WIDTH } from "../design/tokens";
import { VariablePill } from "./shared/VariablePill";

const CENTER_X = VIDEO_WIDTH * 0.5;
const CENTER_Y = VIDEO_HEIGHT * 0.46;

const PILLS = [
  { label: "Design rules", beat: [0.3, 0.5] },
  { label: "Reusable patterns", beat: [0.5, 0.7] },
  { label: "Technology-agnostic tokens", beat: [0.7, 0.85] },
];

export const Scene2TheShift: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = frame / durationInFrames;

  const convergeEnd = 0.3;
  const convergeProgress = interpolate(progress, [0, convergeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.32, 0, 0.15, 1),
  });

  // The one deliberate spring() in the system — a physical "snap into place"
  // moment, per rules/art-direction.md.
  const tokenScale = spring({
    frame: frame - convergeEnd * durationInFrames * 0.8,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const gridConsolidation = interpolate(progress, [0, convergeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const closingProgress = interpolate(progress, [0.85, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gridLines = 7;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white, overflow: "hidden" }}>
      {/* Consolidating grid: screens -> a single highlighted cell behind the Token. */}
      <AbsoluteFill style={{ opacity: 1 - gridConsolidation * 0.85 }}>
        {Array.from({ length: gridLines }).map((_, i) => (
          <div
            key={`v-${i}`}
            style={{ position: "absolute", left: (VIDEO_WIDTH / gridLines) * i, top: 0, bottom: 0, width: 1, background: COLORS.midnight, opacity: 0.08 }}
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`h-${i}`}
            style={{ position: "absolute", top: (VIDEO_HEIGHT / 5) * i, left: 0, right: 0, height: 1, background: COLORS.midnight, opacity: 0.08 }}
          />
        ))}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: CENTER_X - 90,
          top: CENTER_Y - 90,
          width: 180,
          height: 180,
          borderRadius: 24,
          background: COLORS.electricBlue,
          opacity: gridConsolidation * 0.08,
          transform: `scale(${0.4 + gridConsolidation * 0.6})`,
        }}
      />

      {SCREEN_SLOTS.map((slot, i) => {
        const localDelay = i * 0.015;
        const local = interpolate(convergeProgress, [localDelay, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = slot.x + (CENTER_X - slot.x) * local;
        const y = slot.y + (CENTER_Y - slot.y) * local;
        const scale = 1 - local * 0.7;
        return (
          <div key={slot.id} style={{ position: "absolute", left: x, top: y, transform: `scale(${scale})`, opacity: 1 - local }}>
            <ScreenCard x={0} y={0} width={slot.width} height={slot.height} rotation={slot.rotation} accent={slot.accent} />
          </div>
        );
      })}

      {tokenScale > 0.01 && (
        <div style={{ position: "absolute", left: CENTER_X - 70, top: CENTER_Y - 70 }}>
          <Token size={140} glow={tokenScale > 0.9 ? interpolate(frame % 90, [0, 45, 90], [12, 26, 12]) : 0} style={{ transform: `scale(${tokenScale})` }} />
        </div>
      )}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", paddingLeft: CENTER_X + 130 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {PILLS.map((pill) => {
            const local = interpolate(progress, pill.beat as [number, number], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            if (local <= 0) return null;
            return <VariablePill key={pill.label} label={pill.label} progress={local} accent={COLORS.deepViolet} fontSize={TYPE_SCALE.body} />;
          })}
        </div>
      </AbsoluteFill>

      {closingProgress > 0 && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: TYPE_SCALE.h1,
              color: COLORS.ink,
              textAlign: "center",
              maxWidth: 1400,
              opacity: closingProgress,
              transform: `translateY(${(1 - closingProgress) * 24}px)`,
            }}
          >
            Design becomes instructions — not artifacts.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
