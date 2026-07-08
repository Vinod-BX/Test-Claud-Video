import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ConnectorLine } from "./shared/ConnectorLine";
import { DeviceOutline, DeviceKind } from "./shared/DeviceOutline";
import { Token } from "../design/Token";
import { COLORS, FONT_FAMILY, TYPE_SCALE, VIDEO_HEIGHT, VIDEO_WIDTH } from "../design/tokens";

const ORIGIN_X = VIDEO_WIDTH * 0.5;
const ORIGIN_Y = VIDEO_HEIGHT * 0.2;
const LANE_Y = VIDEO_HEIGHT * 0.48;
const GLYPH_Y = VIDEO_HEIGHT * 0.76;

const LANES: { x: number; kind: DeviceKind; label: string; dashed?: boolean }[] = [
  { x: VIDEO_WIDTH * 0.18, kind: "code", label: "React" },
  { x: VIDEO_WIDTH * 0.4, kind: "mobile", label: "Flutter" },
  { x: VIDEO_WIDTH * 0.62, kind: "web", label: "Web" },
  { x: VIDEO_WIDTH * 0.84, kind: "ai", label: "AI", dashed: true },
];

const LABELS = [
  { text: "What a page IS", beat: [0.8, 0.87] },
  { text: "HOW it looks", beat: [0.87, 0.94] },
  { text: "HOW it's built", beat: [0.94, 1] },
];

export const Scene3WhatThisEnables: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const cloneEnd = 0.3;
  const glyphEnd = 0.6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white, overflow: "hidden" }}>
      {/* contextual background: parallel "stream" stripes drifting, tied to
          "same pattern outputs to React, Flutter, or Web" */}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage: `repeating-linear-gradient(90deg, ${COLORS.deepViolet} 0px, ${COLORS.deepViolet} 2px, transparent 2px, transparent 90px)`,
          backgroundPositionX: `${progress * 400}px`,
        }}
      />

      <Token size={70} style={{ position: "absolute", left: ORIGIN_X - 35, top: ORIGIN_Y - 35 }} />

      {LANES.map((lane, i) => {
        const delay = 0.02 * i;
        const cloneProgress = interpolate(progress, [delay, cloneEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        if (cloneProgress <= 0) return null;

        const laneX = ORIGIN_X + (lane.x - ORIGIN_X) * cloneProgress;
        const laneY = ORIGIN_Y + (LANE_Y - ORIGIN_Y) * cloneProgress;
        const tokenSize = 70 - 30 * cloneProgress;

        const isAi = lane.kind === "ai";
        const connectorStart = isAi ? 0.4 : 0.3;
        const connectorEnd = isAi ? glyphEnd : glyphEnd - 0.05;
        const connectorProgress = interpolate(progress, [connectorStart + delay, connectorEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const glyphProgress = interpolate(progress, [connectorStart + delay + 0.05, connectorEnd + 0.05], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <React.Fragment key={lane.kind}>
            <div style={{ position: "absolute", left: laneX - tokenSize / 2, top: laneY - tokenSize / 2 }}>
              <Token size={tokenSize} />
            </div>
            {connectorProgress > 0 && (
              <ConnectorLine
                x1={lane.x}
                y1={LANE_Y + 24}
                x2={lane.x}
                y2={GLYPH_Y - 55}
                progress={connectorProgress}
                color={isAi ? COLORS.indigo : COLORS.deepViolet}
                dashed={isAi}
                trail={!isAi}
              />
            )}
            {glyphProgress > 0 && (
              <div style={{ position: "absolute", left: lane.x - 48, top: GLYPH_Y - 48 }}>
                <DeviceOutline kind={lane.kind} label={lane.label} size={96} accent={isAi ? COLORS.indigo : COLORS.deepViolet} progress={glyphProgress} />
              </div>
            )}
          </React.Fragment>
        );
      })}

      {LABELS.map((label) => {
        const [start, end] = label.beat;
        const fade = (end - start) * 0.25;
        const local = interpolate(progress, [start, start + fade, end - fade, end], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (local <= 0) return null;
        return (
          <AbsoluteFill key={label.text} style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130 }}>
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 800,
                fontSize: TYPE_SCALE.h1,
                color: COLORS.ink,
                opacity: local,
                transform: `translateY(${(1 - local) * 20}px)`,
              }}
            >
              {label.text}
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
