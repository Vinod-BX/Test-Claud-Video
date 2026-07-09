import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { sliceTextByProgress } from "../../design/textReveal";
import { CHIP, FONT_FAMILY, INK, MUTED } from "../tokens";
import { ShoeGlyph } from "./Shot4ProductPage";

const HEADLINE = "One system. Every product.";

const PRODUCTS = [
  { name: "Runner", price: "$129.00", rating: 4.5, count: 207, accent: CHIP.orange, Glyph: ShoeGlyph },
  { name: "Studio Headphones", price: "$199.00", rating: 4.2, count: 89, accent: CHIP.purple, Glyph: HeadphonesGlyphWrapper },
  { name: "Series Watch", price: "$249.00", rating: 4.6, count: 64, accent: CHIP.teal, Glyph: WatchGlyphWrapper },
];

function HeadphonesGlyphWrapper({ accent, size = 220 }: { accent: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <path d="M40 110 A60 60 0 0 1 160 110" fill="none" stroke={accent} strokeWidth={12} strokeLinecap="round" />
      <rect x={26} y={100} width={30} height={50} rx={14} fill={accent} />
      <rect x={144} y={100} width={30} height={50} rx={14} fill={accent} opacity={0.85} />
    </svg>
  );
}

function WatchGlyphWrapper({ accent, size = 220 }: { accent: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <rect x={60} y={20} width={80} height={30} rx={10} fill={accent} opacity={0.5} />
      <rect x={60} y={150} width={80} height={30} rx={10} fill={accent} opacity={0.5} />
      <rect x={44} y={54} width={112} height={92} rx={22} fill="#111318" />
      <circle cx={100} cy={100} r={30} fill="none" stroke={accent} strokeWidth={4} />
    </svg>
  );
}

/**
 * Beat 5 — the single product page (previous beat) multiplies outward into
 * the full family, each card the same token structure with only the accent
 * and content swapped: literal proof that the system scales.
 */
export const Shot5ProductFamily: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  const headlineProgress = interpolate(progress, [0.02, 0.14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closingProgress = interpolate(progress, [0.86, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
            fontSize: 48,
            color: INK,
            opacity: headlineProgress,
          }}
        >
          {sliceTextByProgress(HEADLINE, headlineProgress)}
        </div>
      )}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 40 }}>
        <div style={{ display: "flex", gap: 44 }}>
          {PRODUCTS.map((p, i) => {
            const cardIn = interpolate(progress, [0.18 + i * 0.1, 0.34 + i * 0.1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.back(1.2)),
            });
            const Glyph = p.Glyph;
            return (
              <div
                key={p.name}
                style={{
                  width: 420,
                  borderRadius: 24,
                  background: "#FFFFFF",
                  boxShadow: "0 30px 70px rgba(11,15,26,0.12)",
                  opacity: cardIn,
                  transform: `translateY(${(1 - cardIn) * 60}px) scale(${0.9 + cardIn * 0.1})`,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <div style={{ height: 3 * 60 - 4, borderRadius: 16, background: "#F4F5F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph accent={p.accent} size={150} />
                </div>
                <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 26, color: INK }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 30, color: INK }}>{p.price}</div>
                  <div style={{ fontFamily: FONT_FAMILY, fontSize: 18, color: MUTED }}>({p.count})</div>
                </div>
                <div
                  style={{
                    height: 54,
                    borderRadius: 14,
                    background: p.accent,
                    color: "#FFFFFF",
                    fontFamily: FONT_FAMILY,
                    fontWeight: 700,
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Add to Cart
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {closingProgress > 0 && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 80 }}>
          <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 30, color: MUTED, opacity: closingProgress }}>
            Design Token System — locked
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
