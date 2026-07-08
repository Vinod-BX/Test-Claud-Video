import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BrandMark } from "../design/BrandMark";
import { ScreenCard } from "../design/ScreenCard";
import { SCREEN_SLOTS } from "../design/sceneGridLayout";
import { sliceTextByProgress } from "../design/textReveal";
import { COLORS, FONT_FAMILY, TYPE_SCALE, VIDEO_HEIGHT, VIDEO_WIDTH } from "../design/tokens";
import { ConnectorLine } from "./shared/ConnectorLine";
import { FigmaGridBackdrop } from "./shared/FigmaGridBackdrop";
import { NetworkNode } from "./shared/NetworkNode";

const CENTER_X = VIDEO_WIDTH * 0.5;
const CENTER_Y = VIDEO_HEIGHT * 0.52;
const NODE_COUNT = 12;
const RING_RADIUS = 300;

const NODES = Array.from({ length: NODE_COUNT }).map((_, i) => {
  const angle = (i / NODE_COUNT) * Math.PI * 2;
  return { id: i, x: CENTER_X + Math.cos(angle) * RING_RADIUS, y: CENTER_Y + Math.sin(angle) * RING_RADIUS };
});

const CTA_LINE_1 = "Does this excite you?";
const CTA_LINE_2 = "Let's start building together!";

/**
 * The loop payoff. By the scene's true last frame, this must render
 * pixel-identical to Scene1Opening's frame 0 (same SCREEN_SLOTS positions,
 * no CTA text, no lattice remnants) — see rules/art-direction.md and the
 * plan's loop-mechanics section.
 */
export const Scene7Closing: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const contractEnd = 0.267;
  const emitEnd = 0.467;
  const ctaFadeStart = 0.933;

  const contractProgress = interpolate(progress, [0, contractEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // All cards share ONE progress value (no per-card stagger/noise) so they
  // arrive in unison — the direct visual payoff of "reconfigured, not rebuilt".
  const emitProgress = interpolate(progress, [contractEnd, emitEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  const ctaProgress = interpolate(progress, [emitEnd, emitEnd + 0.08], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaFade = interpolate(progress, [ctaFadeStart, 0.98], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaOpacity = Math.min(ctaProgress, ctaFade);

  const line1Reveal = interpolate(progress, [emitEnd + 0.02, emitEnd + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Reveal = interpolate(progress, [emitEnd + 0.14, emitEnd + 0.26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const showLattice = contractProgress < 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white, overflow: "hidden" }}>
      <FigmaGridBackdrop panProgress={0} opacity={0.04} />

      {showLattice &&
        NODES.map((node, i) => {
          const next = NODES[(i + 1) % NODES.length];
          const x1 = node.x + (CENTER_X - node.x) * contractProgress;
          const y1 = node.y + (CENTER_Y - node.y) * contractProgress;
          const x2 = next.x + (CENTER_X - next.x) * contractProgress;
          const y2 = next.y + (CENTER_Y - next.y) * contractProgress;
          return (
            <ConnectorLine key={`edge-${node.id}`} x1={x1} y1={y1} x2={x2} y2={y2} progress={1 - contractProgress} color={COLORS.deepViolet} />
          );
        })}

      {showLattice &&
        NODES.map((node) => {
          const x = node.x + (CENTER_X - node.x) * contractProgress;
          const y = node.y + (CENTER_Y - node.y) * contractProgress;
          return <NetworkNode key={node.id} x={x} y={y} size={40} morphProgress={1 - contractProgress} opacity={1 - contractProgress * 0.3} />;
        })}

      {contractProgress >= 1 && emitProgress < 1 && (
        <NetworkNode x={CENTER_X} y={CENTER_Y} size={140 - 40 * emitProgress} morphProgress={0} opacity={1 - emitProgress} />
      )}

      {SCREEN_SLOTS.map((slot) => {
        const x = CENTER_X + (slot.x - CENTER_X) * emitProgress;
        const y = CENTER_Y + (slot.y - CENTER_Y) * emitProgress;
        const width = 40 + (slot.width - 40) * emitProgress;
        const height = 40 + (slot.height - 40) * emitProgress;
        const rotation = slot.rotation * emitProgress;
        return (
          <ScreenCard
            key={slot.id}
            x={emitProgress >= 1 ? slot.x : x}
            y={emitProgress >= 1 ? slot.y : y}
            width={emitProgress >= 1 ? slot.width : width}
            height={emitProgress >= 1 ? slot.height : height}
            rotation={emitProgress >= 1 ? slot.rotation : rotation}
            accent={slot.accent}
            opacity={emitProgress}
          />
        );
      })}

      {ctaOpacity > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              opacity: ctaOpacity,
              background: "rgba(255,255,255,0.88)",
              padding: "48px 72px",
              borderRadius: 32,
            }}
          >
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: TYPE_SCALE.h1, color: COLORS.ink, textAlign: "center" }}>
              {sliceTextByProgress(CTA_LINE_1, line1Reveal)}
            </div>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: TYPE_SCALE.h1, color: COLORS.deepViolet, textAlign: "center" }}>
              {sliceTextByProgress(CTA_LINE_2, line2Reveal)}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {ctaOpacity > 0 && (
        <div style={{ position: "absolute", left: 90, bottom: 70, opacity: ctaOpacity }}>
          <BrandMark size={40} />
        </div>
      )}
    </AbsoluteFill>
  );
};
