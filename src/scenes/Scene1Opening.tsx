import { noise2D } from "@remotion/noise";
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ScreenCard } from "../design/ScreenCard";
import { SCREEN_SLOTS } from "../design/sceneGridLayout";
import { sliceTextByProgress } from "../design/textReveal";
import { COLORS, FONT_FAMILY, TYPE_SCALE } from "../design/tokens";
import { FigmaGridBackdrop } from "./shared/FigmaGridBackdrop";

const HEADLINE = "That's not scale. That's duplication.";

// Duplicate "clones" spawned near specific cards as each rebuild-cause clause
// is spoken — literal, on-the-nose duplication rather than decorative jitter.
const DUPLICATE_CUES = [
  { parentIndex: 0, dx: 60, dy: -40, accent: COLORS.electricBlue, beat: [0.3, 0.42] },
  { parentIndex: 1, dx: -50, dy: 50, accent: COLORS.purpleRain, beat: [0.42, 0.54] },
  { parentIndex: 2, dx: 40, dy: 40, accent: COLORS.indigo, beat: [0.54, 0.66], dashed: true },
];

export const Scene1Opening: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  // Beat windows, as fractions of the scene — see rules/art-direction.md and
  // the plan for why each beat exists.
  const holdEnd = 0.027;
  const chaosRampEnd = 0.267;
  const causesEnd = 0.6;
  const cameraEnd = 0.8;
  const sweepEnd = 0.933;

  const chaosEnvelope = interpolate(progress, [holdEnd, chaosRampEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Chaos keeps drifting at reduced amplitude through the rest of the scene
  // rather than freezing, but settles for the closing stamp.
  const chaosSustain = interpolate(progress, [causesEnd, 1], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chaosAmount = chaosEnvelope * chaosSustain;

  const cameraProgress = interpolate(progress, [chaosRampEnd, cameraEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const sweepProgress = interpolate(progress, [cameraEnd, sweepEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headlineProgress = interpolate(progress, [sweepEnd, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardOffsets = useMemo(
    () =>
      SCREEN_SLOTS.map((_, i) => ({
        dx: noise2D(`s1-drift-x-${i}`, frame * 0.01, i) * 130,
        dy: noise2D(`s1-drift-y-${i}`, frame * 0.01, i + 50) * 90,
        drot: noise2D(`s1-drift-r-${i}`, frame * 0.008, i + 100) * 14,
      })),
    [frame],
  );

  // Camera push: scale into the "product page" (0) / "checkout flow" (1)
  // cards, defocusing the rest.
  const focusIndices = [0, 1];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white, overflow: "hidden" }}>
      <FigmaGridBackdrop panProgress={progress} opacity={0.04} />

      <AbsoluteFill
        style={{
          transform: `scale(${1 + cameraProgress * 0.35})`,
          transformOrigin: "45% 42%",
        }}
      >
        {SCREEN_SLOTS.map((slot, i) => {
          const isFocused = focusIndices.includes(i);
          const defocus = cameraProgress * (isFocused ? 0 : 1);
          const x = slot.x + cardOffsets[i].dx * chaosAmount;
          const y = slot.y + cardOffsets[i].dy * chaosAmount;
          const rotation = slot.rotation + cardOffsets[i].drot * chaosAmount;
          const isSweepTarget = i === 0 && sweepProgress > 0 && sweepProgress < 1;

          return (
            <ScreenCard
              key={slot.id}
              x={x}
              y={y}
              width={slot.width}
              height={slot.height}
              rotation={rotation}
              accent={slot.accent}
              opacity={1 - defocus * 0.55}
              filterBlurPx={defocus * 6}
              drawProgress={isSweepTarget ? sweepProgress : undefined}
            >
              {isFocused && cameraProgress > 0.3 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -44,
                    left: 0,
                    fontFamily: FONT_FAMILY,
                    fontWeight: 700,
                    fontSize: TYPE_SCALE.label,
                    color: COLORS.ink,
                    opacity: interpolate(cameraProgress, [0.3, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  }}
                >
                  {i === 0 ? "Product Page" : "Checkout Flow"}
                </div>
              )}
            </ScreenCard>
          );
        })}

        {DUPLICATE_CUES.map((cue, i) => {
          const local = interpolate(progress, cue.beat as [number, number], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.4)),
          });
          if (local <= 0) {
            return null;
          }
          const parent = SCREEN_SLOTS[cue.parentIndex];
          return (
            <ScreenCard
              key={`dup-${i}`}
              x={parent.x + cue.dx + cardOffsets[cue.parentIndex].dx * chaosAmount}
              y={parent.y + cue.dy + cardOffsets[cue.parentIndex].dy * chaosAmount}
              width={parent.width * 0.7}
              height={parent.height * 0.7}
              rotation={parent.rotation + (cue.dashed ? 8 : -6)}
              accent={cue.accent}
              opacity={local}
              drawProgress={cue.dashed ? undefined : Math.min(1, local * 1.4)}
            />
          );
        })}
      </AbsoluteFill>

      {headlineProgress > 0 && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 140 }}>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: TYPE_SCALE.h1,
              color: COLORS.ink,
              textAlign: "center",
              maxWidth: 1400,
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
