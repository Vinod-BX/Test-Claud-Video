import { noise2D } from "@remotion/noise";
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ConnectorLine } from "./shared/ConnectorLine";
import { NetworkNode } from "./shared/NetworkNode";
import { COLORS, FONT_FAMILY, TYPE_SCALE, VIDEO_HEIGHT, VIDEO_WIDTH } from "../design/tokens";

const CENTER_X = VIDEO_WIDTH * 0.5;
const CENTER_Y = VIDEO_HEIGHT * 0.52;
const NODE_COUNT = 12;
const RING_RADIUS = 300;

const NODES = Array.from({ length: NODE_COUNT }).map((_, i) => {
  const angle = (i / NODE_COUNT) * Math.PI * 2;
  return {
    id: i,
    x: CENTER_X + Math.cos(angle) * RING_RADIUS,
    y: CENTER_Y + Math.sin(angle) * RING_RADIUS,
    size: 34 + (i % 3) * 10,
    cluster: i % 3,
  };
});

const CLUSTER_COLORS = [COLORS.deepViolet, COLORS.purpleRain, COLORS.electricBlue];
const FRAGMENT_NODES = [3, 8];
const CALLOUTS = [
  { text: "Less duplication", beat: [0, 0.1] },
  { text: "Faster multi-brand delivery", beat: [0.1, 0.2] },
  { text: "Safer AI adoption", beat: [0.2, 0.3] },
];

export const Scene6WhyThisMatters: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const formEnd = 0.32;
  const fragmentBeat: [number, number] = [0.32, 0.56];
  const cameraStart = 0.72;

  const formProgress = interpolate(progress, [0, formEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const fragmentLocal = interpolate(progress, fragmentBeat, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fragmentFlicker = Math.sin(fragmentLocal * Math.PI * 3) * (fragmentLocal < 1 ? 1 : 0);

  const cameraScale = interpolate(progress, [cameraStart, 1], [1, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rotation = progress * 22; // the continuous orbit IS the background motion

  const nodeOrigins = useMemo(
    () =>
      NODES.map((n) => ({
        ox: CENTER_X + noise2D(`s6-origin-x-${n.id}`, n.id, 1) * 700,
        oy: CENTER_Y + noise2D(`s6-origin-y-${n.id}`, n.id, 2) * 500,
      })),
    [],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale}) rotate(${rotation}deg)`,
          transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
        }}
      >
        {NODES.map((node, i) => {
          const next = NODES[(i + 1) % NODES.length];
          const isFragmenting = FRAGMENT_NODES.includes(node.id);
          const connectorOpacity = isFragmenting ? interpolate(fragmentFlicker, [-1, 0, 1], [0.15, 1, 0.15]) : 1;
          return (
            <div key={`edge-${node.id}`} style={{ opacity: connectorOpacity }}>
              <ConnectorLine
                x1={CENTER_X + (node.x - CENTER_X) * formProgress + (nodeOrigins[i].ox - node.x) * (1 - formProgress)}
                y1={CENTER_Y + (node.y - CENTER_Y) * formProgress + (nodeOrigins[i].oy - node.y) * (1 - formProgress)}
                x2={CENTER_X + (next.x - CENTER_X) * formProgress + (nodeOrigins[(i + 1) % NODES.length].ox - next.x) * (1 - formProgress)}
                y2={CENTER_Y + (next.y - CENTER_Y) * formProgress + (nodeOrigins[(i + 1) % NODES.length].oy - next.y) * (1 - formProgress)}
                progress={formProgress}
                color={CLUSTER_COLORS[node.cluster]}
                trail={progress > 0.56 && progress < 0.72}
              />
            </div>
          );
        })}

        {NODES.map((node, i) => {
          const x = CENTER_X + (node.x - CENTER_X) * formProgress + (nodeOrigins[i].ox - node.x) * (1 - formProgress);
          const y = CENTER_Y + (node.y - CENTER_Y) * formProgress + (nodeOrigins[i].oy - node.y) * (1 - formProgress);
          const pulse = progress > 0.56 && progress < 0.72 ? 1 + Math.sin(progress * 40 + node.cluster * 2) * 0.08 : 1;
          return (
            <NetworkNode
              key={node.id}
              x={x}
              y={y}
              size={node.size * pulse}
              morphProgress={formProgress}
              opacity={interpolate(formProgress, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
          );
        })}
      </AbsoluteFill>

      {CALLOUTS.map((callout) => {
        const [start, end] = callout.beat;
        const local = interpolate(progress, [start, start + 0.03, end - 0.03, end], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (local <= 0) return null;
        return (
          <AbsoluteFill key={callout.text} style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 110 }}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: TYPE_SCALE.h1, color: COLORS.ink, opacity: local }}>{callout.text}</div>
          </AbsoluteFill>
        );
      })}

      {progress > cameraStart && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130 }}>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              fontSize: TYPE_SCALE.h1,
              color: COLORS.ink,
              textAlign: "center",
              maxWidth: 1500,
              opacity: interpolate(progress, [cameraStart, cameraStart + 0.08], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            Design becomes predictable, scalable, and strategically aligned.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
