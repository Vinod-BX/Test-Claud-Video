import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { sliceTextByProgress } from "../design/textReveal";
import { COLORS, FONT_FAMILY, RADIUS, TYPE_SCALE, VIDEO_WIDTH } from "../design/tokens";

const TOOLS = [
  { name: "Lovable", x: VIDEO_WIDTH * 0.24, radius: RADIUS.md, dash: false },
  { name: "Cursor", x: VIDEO_WIDTH * 0.5, radius: RADIUS.sm, dash: true },
  { name: "Builder.io", x: VIDEO_WIDTH * 0.76, radius: RADIUS.lg, dash: false },
];

// CSS gradients can't be fed through interpolateStyles (different color stops
// aren't "animatable values"), so each brand recolor is a separate static
// layer cross-faded by opacity instead of an interpolated gradient string.
const TOKEN_GRADIENTS = [
  `linear-gradient(135deg, ${COLORS.midnight}, ${COLORS.deepViolet})`,
  `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.electricBlue})`,
  `linear-gradient(135deg, ${COLORS.deepViolet}, ${COLORS.purpleRain})`,
];

export const Scene5CrossPlatformGeneration: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const lanesEnd = 0.4;
  const chromeEnd = 0.55;
  const tokenStart = 0.7;

  const tokenLocal = interpolate(progress, [tokenStart, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gradientCrossfades = TOKEN_GRADIENTS.map((_, i) => {
    const step = 1 / (TOKEN_GRADIENTS.length - 1);
    return interpolate(tokenLocal, [(i - 1) * step, i * step, (i + 1) * step], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white, overflow: "hidden" }}>
      {TOOLS.map((tool, i) => {
        const pulsePhase = (progress * 90 + i * 30) % 90;
        const pulse = interpolate(pulsePhase, [0, 45, 90], [0.02, 0.09, 0.02]);
        return (
          <div
            key={tool.name}
            style={{
              position: "absolute",
              left: tool.x - 90,
              top: 0,
              bottom: 0,
              width: 180,
              background: `linear-gradient(180deg, transparent, ${COLORS.deepViolet}, transparent)`,
              opacity: pulse,
            }}
          />
        );
      })}

      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 110 }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "18px 32px",
            border: `2px solid ${COLORS.midnight}`,
            borderRadius: RADIUS.md,
            fontFamily: "monospace",
            fontSize: TYPE_SCALE.label,
            color: COLORS.ink,
            opacity: interpolate(progress, [0, 0.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ color: COLORS.electricBlue }}>JSON</span>
          <span>+</span>
          <span style={{ color: COLORS.deepViolet }}># Markdown</span>
        </div>
      </AbsoluteFill>

      {TOOLS.map((tool, i) => {
        const delay = i * 0.06;
        const local = interpolate(progress, [delay, lanesEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (local <= 0) return null;
        const chromeLocal = interpolate(progress, [lanesEnd, chromeEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const radius = tool.radius + (tool.dash ? chromeLocal * 4 : 0);
        return (
          <div
            key={tool.name}
            style={{
              position: "absolute",
              left: tool.x - 140,
              top: 300,
              width: 280,
              height: 320,
              borderRadius: radius,
              border: `2px ${tool.dash ? "dashed" : "solid"} ${COLORS.deepViolet}`,
              opacity: local,
              transform: `translateY(${(1 - local) * 30}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 24,
            }}
          >
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: TYPE_SCALE.h3, color: COLORS.ink }}>
              {sliceTextByProgress(tool.name, local)}
            </div>
          </div>
        );
      })}

      {/* the unchanged pattern line beneath every lane, while the tools' chrome differs above it */}
      <div
        style={{
          position: "absolute",
          left: VIDEO_WIDTH * 0.15,
          right: VIDEO_WIDTH * 0.15,
          top: 660,
          height: 3,
          background: COLORS.midnight,
          opacity: interpolate(progress, [lanesEnd, lanesEnd + 0.1], [0, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      />

      {tokenLocal > 0 && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: tokenLocal }}>
            <div style={{ position: "relative", width: 90, height: 90 }}>
              {TOKEN_GRADIENTS.map((gradient, i) => (
                <div
                  key={gradient}
                  style={{ position: "absolute", inset: 0, borderRadius: 20, background: gradient, opacity: gradientCrossfades[i] }}
                />
              ))}
            </div>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: TYPE_SCALE.body, color: COLORS.ink }}>
              Brands swap by changing tokens.
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
