import { evolvePath } from "@remotion/paths";
import { makeRect } from "@remotion/shapes";
import { interpolateStyles } from "@remotion/animation-utils";
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BRAND_GRADIENT_STOPS, COLORS, FONT_FAMILY, RADIUS, TYPE_SCALE } from "../design/tokens";
import { sliceTextByProgress } from "../design/textReveal";
import { FigmaGridBackdrop } from "./shared/FigmaGridBackdrop";
import { VariablePill } from "./shared/VariablePill";

const FRAME = { x: 210, y: 190, w: 900, h: 700 };

const DrawnRect: React.FC<{ x: number; y: number; w: number; h: number; progress: number; color?: string; radius?: number }> = ({
  x,
  y,
  w,
  h,
  progress,
  color = COLORS.deepViolet,
  radius = RADIUS.sm,
}) => {
  const d = useMemo(() => makeRect({ width: w, height: h, cornerRadius: radius }).path, [w, h, radius]);
  const { strokeDasharray, strokeDashoffset } = useMemo(() => evolvePath(progress, d), [progress, d]);
  if (progress <= 0) return null;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={w} height={h}>
      <path d={d} fill="none" stroke={color} strokeWidth={3} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
    </svg>
  );
};

const COMPONENT_STATES: React.CSSProperties[] = [
  { background: COLORS.deepViolet, borderRadius: 8, boxShadow: `0 0 0 0px ${COLORS.deepViolet}` },
  { background: COLORS.electricBlue, borderRadius: 28, boxShadow: `0 0 0 6px rgba(52,180,255,0.25)` },
  { background: COLORS.purpleRain, borderRadius: 4, boxShadow: `0 0 0 0px ${COLORS.purpleRain}` },
  { background: COLORS.indigo, borderRadius: 999, boxShadow: `0 0 0 6px rgba(51,19,159,0.2)` },
];

export const Scene4HowItWorks: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const b = {
    frame: [0, 0.143],
    foundations: [0.143, 0.371],
    component: [0.371, 0.571],
    pdp: [0.571, 0.714],
    annotate: [0.714, 0.857],
    split: [0.857, 1],
  };

  const frameProgress = interpolate(progress, b.frame, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const foundationsProgress = interpolate(progress, b.foundations, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const componentLocal = interpolate(progress, b.component, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pdpProgress = interpolate(progress, b.pdp, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const annotateProgress = interpolate(progress, b.annotate, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const splitProgress = interpolate(progress, b.split, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const componentStyle = interpolateStyles(
    componentLocal,
    [0, 0.33, 0.66, 1],
    COMPONENT_STATES,
  );

  const showPdp = pdpProgress > 0 || annotateProgress > 0;
  const contentFade = 1 - splitProgress;

  const pdpRegions = [
    { key: "hero", x: 60, y: 70, w: 780, h: 260 },
    { key: "title", x: 60, y: 350, w: 500, h: 40 },
    { key: "price", x: 60, y: 405, w: 220, h: 40 },
    { key: "cta", x: 60, y: 465, w: 260, h: 60 },
    { key: "desc1", x: 60, y: 545, w: 780, h: 18 },
    { key: "desc2", x: 60, y: 575, w: 620, h: 18 },
  ];

  const annotations = [
    { label: "region: hero", x: 460, y: 100, beat: [0, 0.35] },
    { label: "behavior: CTA action", x: 340, y: 495, beat: [0.35, 0.7] },
    { label: "intent: convert", x: 700, y: 555, beat: [0.7, 1] },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white, overflow: "hidden" }}>
      <FigmaGridBackdrop panProgress={progress} opacity={0.1} cellSize={44} />

      <div style={{ opacity: contentFade }}>
        <DrawnRect x={FRAME.x} y={FRAME.y} w={FRAME.w} h={FRAME.h} progress={frameProgress} color={COLORS.midnight} radius={RADIUS.lg} />
        {/* layers panel */}
        {frameProgress > 0.4 &&
          [0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: FRAME.x + 22,
                top: FRAME.y + 30 + i * 26,
                width: 90 * interpolate(frameProgress, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                height: 8,
                borderRadius: 4,
                background: COLORS.midnight,
                opacity: 0.15,
              }}
            />
          ))}

        {/* Foundations: color swatches, spacing bars, radius scale */}
        {foundationsProgress > 0 && !showPdp && (
          <AbsoluteFill>
            <div style={{ position: "absolute", left: FRAME.x + 150, top: FRAME.y + 70, display: "flex", gap: 14 }}>
              {BRAND_GRADIENT_STOPS.map((color, i) => {
                const local = interpolate(foundationsProgress, [i * 0.08, i * 0.08 + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={color} style={{ width: 64, height: 64, borderRadius: 12, background: color, transform: `scale(${local})`, opacity: local }} />
                );
              })}
            </div>
            <div style={{ position: "absolute", left: FRAME.x + 150, top: FRAME.y + 170, display: "flex", flexDirection: "column", gap: 12 }}>
              {[40, 80, 130, 190].map((w, i) => {
                const local = interpolate(foundationsProgress, [0.25 + i * 0.08, 0.55 + i * 0.08], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return <div key={w} style={{ width: w * local, height: 14, borderRadius: 7, background: COLORS.deepViolet, opacity: local }} />;
              })}
            </div>
            <div style={{ position: "absolute", left: FRAME.x + 150, top: FRAME.y + 300, display: "flex", gap: 16 }}>
              {[0, 8, 16, 28].map((r, i) => {
                const local = interpolate(foundationsProgress, [0.4 + i * 0.08, 0.7 + i * 0.08], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={r} style={{ width: 50, height: 50, borderRadius: r, border: `3px solid ${COLORS.purpleRain}`, transform: `scale(${local})`, opacity: local }} />
                );
              })}
            </div>
            <div style={{ position: "absolute", left: FRAME.x + 150, top: FRAME.y + 20 }}>
              <VariablePill
                label="color/primary"
                progress={interpolate(foundationsProgress, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                accent={COLORS.indigo}
                monospace
                fontSize={TYPE_SCALE.label}
              />
            </div>
          </AbsoluteFill>
        )}

        {/* One component, multiple expressions */}
        {componentLocal > 0 && !showPdp && (
          <div
            style={{
              position: "absolute",
              left: FRAME.x + 150,
              top: FRAME.y + 470,
              width: 220,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.white,
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: TYPE_SCALE.body,
              ...componentStyle,
            }}
          >
            Button
          </div>
        )}

        {/* Product Detail Page wireframe */}
        {showPdp && (
          <div style={{ opacity: 1 - splitProgress }}>
            {pdpRegions.map((region, i) => {
              const local = interpolate(pdpProgress, [i * 0.12, i * 0.12 + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <DrawnRect key={region.key} x={FRAME.x + region.x} y={FRAME.y + region.y} w={region.w} h={region.h} progress={local} color={COLORS.deepViolet} />
              );
            })}
            {annotations.map((a) => {
              const [start, end] = a.beat;
              const local = interpolate(annotateProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              if (local <= 0) return null;
              return (
                <div key={a.label} style={{ position: "absolute", left: FRAME.x + a.x, top: FRAME.y + a.y, opacity: local }}>
                  <VariablePill label={a.label} progress={1} accent={COLORS.purpleRain} fontSize={TYPE_SCALE.label} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* JSON / Markdown split */}
      {splitProgress > 0 && (
        <AbsoluteFill style={{ display: "flex", flexDirection: "row", padding: "0 120px", alignItems: "center", gap: 60 }}>
          <div
            style={{
              flex: 1,
              opacity: splitProgress,
              transform: `translateX(${(1 - splitProgress) * -60}px)`,
              background: COLORS.midnight,
              borderRadius: RADIUS.lg,
              padding: 40,
              color: COLORS.white,
              fontFamily: "monospace",
              fontSize: TYPE_SCALE.label,
            }}
          >
            <div style={{ color: COLORS.electricBlue, marginBottom: 12, fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: TYPE_SCALE.h3 }}>JSON</div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {sliceTextByProgress('{\n  "region": "hero",\n  "behavior": "cta.convert"\n}', interpolate(splitProgress, [0.15, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
            </pre>
          </div>
          <div
            style={{
              flex: 1,
              opacity: splitProgress,
              transform: `translateX(${(1 - splitProgress) * 60}px)`,
              background: COLORS.white,
              border: `2px solid ${COLORS.deepViolet}`,
              borderRadius: RADIUS.lg,
              padding: 40,
              color: COLORS.ink,
              fontFamily: FONT_FAMILY,
              fontSize: TYPE_SCALE.label,
            }}
          >
            <div style={{ color: COLORS.deepViolet, marginBottom: 12, fontWeight: 800, fontSize: TYPE_SCALE.h3 }}># Markdown</div>
            <div>{sliceTextByProgress("This page converts a visitor into a buyer.", interpolate(splitProgress, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
