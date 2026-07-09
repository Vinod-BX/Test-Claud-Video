import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { sliceTextByProgress } from "../../design/textReveal";
import { CHIP, FONT_FAMILY, HAIRLINE, INK, MUTED } from "../tokens";

const HEADLINE = "The system, applied.";

const SIZES = ["7", "8", "9", "10", "11"];
const SWATCHES = [CHIP.orange, CHIP.blue, CHIP.pink, INK];

const stagger = (progress: number, start: number, span: number, index: number, gap: number) =>
  interpolate(progress, [start + index * gap, start + index * gap + span], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/**
 * Beat 4 — the abstract token panel resolves into a real, working product
 * page, built piece by piece in the same order the tokens were introduced:
 * elevation/radius (card), grid (image + thumbnails), typography (copy),
 * color (swatches/CTA). No stock photography — the "product" is an abstract
 * silhouette in the brand accent, consistent with the system's own vocabulary.
 */
export const Shot4ProductPage: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const cardIn = interpolate(progress, [0.02, 0.14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const imageIn = interpolate(progress, [0.14, 0.26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleIn = interpolate(progress, [0.28, 0.36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const priceIn = interpolate(progress, [0.4, 0.48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ratingIn = interpolate(progress, [0.48, 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaIn = interpolate(progress, [0.8, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headlineProgress = interpolate(progress, [0.92, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${CHIP.purple}22, ${CHIP.orange}18 45%, ${CHIP.blue}22)`,
      }}
    >
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 1360,
            height: 780,
            borderRadius: 32,
            background: "#FFFFFF",
            boxShadow: "0 60px 140px rgba(11,15,26,0.16)",
            opacity: cardIn,
            transform: `scale(${0.94 + cardIn * 0.06})`,
            display: "flex",
            padding: 56,
            gap: 56,
          }}
        >
          {/* Image column */}
          <div style={{ flex: 1.1, display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                flex: 1,
                borderRadius: 24,
                background: "#F4F5F8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: imageIn,
                transform: `scale(${0.9 + imageIn * 0.1})`,
              }}
            >
              <ShoeGlyph accent={CHIP.orange} />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {SWATCHES.map((c, i) => {
                const thumbIn = stagger(progress, 0.3, 0.08, i, 0.03);
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 96,
                      borderRadius: 14,
                      background: "#F4F5F8",
                      opacity: thumbIn,
                      border: i === 0 ? `2px solid ${CHIP.blue}` : `1px solid ${HAIRLINE}`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Detail column */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26, paddingTop: 12 }}>
            {titleIn > 0 && (
              <div style={{ opacity: titleIn, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ width: 320, height: 22, borderRadius: 6, background: "#EEF0F4" }} />
                <div style={{ width: 220, height: 16, borderRadius: 6, background: "#EEF0F4" }} />
              </div>
            )}

            {priceIn > 0 && (
              <div style={{ opacity: priceIn, fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 44, color: INK }}>$129.00</div>
            )}

            {ratingIn > 0 && (
              <div style={{ opacity: ratingIn, display: "flex", gap: 8, alignItems: "center" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ width: 20, height: 20, borderRadius: 5, background: i < 4 ? CHIP.orange : "#EEF0F4" }} />
                ))}
                <div style={{ fontFamily: FONT_FAMILY, fontSize: 22, color: MUTED, marginLeft: 8 }}>(207)</div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 22, color: MUTED }}>Size</div>
              <div style={{ display: "flex", gap: 12 }}>
                {SIZES.map((s, i) => {
                  const sizeIn = stagger(progress, 0.56, 0.08, i, 0.04);
                  return (
                    <div
                      key={s}
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: 14,
                        border: `2px solid ${s === "9" ? CHIP.blue : HAIRLINE}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: FONT_FAMILY,
                        fontWeight: 700,
                        fontSize: 24,
                        color: INK,
                        opacity: sizeIn,
                        transform: `translateY(${(1 - sizeIn) * 14}px)`,
                      }}
                    >
                      {s}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 22, color: MUTED }}>Color</div>
              <div style={{ display: "flex", gap: 14 }}>
                {SWATCHES.map((c, i) => {
                  const swIn = stagger(progress, 0.68, 0.06, i, 0.03);
                  return (
                    <div
                      key={i}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: c,
                        opacity: swIn,
                        transform: `scale(${0.5 + swIn * 0.5})`,
                        boxShadow: i === 0 ? `0 0 0 3px #FFFFFF, 0 0 0 5px ${c}` : undefined,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {ctaIn > 0 && (
              <div style={{ opacity: ctaIn, transform: `translateY(${(1 - ctaIn) * 16}px)`, marginTop: "auto" }}>
                <div
                  style={{
                    height: 76,
                    borderRadius: 18,
                    background: CHIP.blue,
                    color: "#FFFFFF",
                    fontFamily: FONT_FAMILY,
                    fontWeight: 800,
                    fontSize: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Add to Cart
                </div>
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>

      {headlineProgress > 0 && (
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 96,
            fontFamily: FONT_FAMILY,
            fontWeight: 800,
            fontSize: 48,
            color: INK,
            opacity: headlineProgress,
          }}
        >
          {sliceTextByProgress(HEADLINE, headlineProgress)}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Abstract sneaker silhouette — no stock photography, matches the system's own abstract vocabulary. */
export const ShoeGlyph: React.FC<{ accent: string; size?: number }> = ({ accent, size = 220 }) => (
  <svg width={size * 1.6} height={size} viewBox="0 0 320 200">
    <path
      d="M20 150 C20 120 60 100 100 95 L170 60 C200 45 240 45 260 65 C280 85 285 110 280 130 L280 150 Z"
      fill={accent}
      opacity={0.92}
    />
    <path d="M20 150 L280 150 L280 168 C280 176 274 182 266 182 L34 182 C26 182 20 176 20 168 Z" fill="#111318" opacity={0.9} />
    <path d="M100 95 L170 60" stroke="#FFFFFF" strokeWidth={4} opacity={0.6} strokeLinecap="round" />
  </svg>
);
