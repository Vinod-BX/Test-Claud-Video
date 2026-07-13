import React from "react";
import { spring } from "remotion";
import { COLORS, FONT_FAMILY } from "../tokens";
import { ProductGlyph } from "./ProductGlyph";
import { PdpVariation } from "./variations";

export type PDPCardProps = {
  variation: PdpVariation;
  /** Frame local to this card's own assembly clock (0 = first region starts snapping in). */
  frame: number;
  fps: number;
  /** 0 = fully assembled/branded, 1 = flattened to a grayscale structural wireframe (Shot 6). */
  identityProgress?: number;
  width?: number;
};

const CARD_W = 900;
const CARD_H = 620;

const REGIONS = ["image", "title", "price", "rating", "size", "color", "cta", "gallery"] as const;

/**
 * The one Product Detail Page structure every shot reuses — Shot 3 assembles
 * it region by region, Shot 4 restyles it in place, Shot 5 tiles many small
 * instances of it, Shot 6 flattens it back to grid geometry. Structure never
 * changes between shots, only the props do.
 */
export const PDPCard: React.FC<PDPCardProps> = ({ variation, frame, fps, identityProgress = 0, width = CARD_W }) => {
  const scale = width / CARD_W;
  const { accent, radius, fontWeight, spacing, product, title, price, rating, reviewCount } = variation;

  const regionProgress = (index: number): number => {
    const local = spring({ frame: frame - index * 2.5, fps, config: { damping: 16, mass: 0.5 } });
    return Math.max(0, Math.min(1, local));
  };

  const p = Object.fromEntries(REGIONS.map((r, i) => [r, regionProgress(i)])) as Record<(typeof REGIONS)[number], number>;

  const flat = identityProgress;
  const structColor = COLORS.midnight;
  const borderMix = flat > 0 ? `2px solid ${structColor}` : "none";
  const contentOpacity = 1 - flat;

  const snap = (progress: number, dx = 0, dy = 18): React.CSSProperties => ({
    opacity: progress,
    transform: `translate(${(1 - progress) * dx}px, ${(1 - progress) * dy}px)`,
  });

  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        background: flat > 0 ? "transparent" : COLORS.white,
        borderRadius: radius,
        border: flat > 0 ? `2px solid ${structColor}` : `1px solid rgba(11,17,28,0.08)`,
        boxShadow: flat > 0 ? "none" : "0 30px 70px rgba(11,17,28,0.10)",
        overflow: "hidden",
        opacity: flat >= 1 ? 0.55 : 1,
      }}
    >
      {/* image block */}
      <div
        style={{
          position: "absolute",
          left: spacing,
          top: spacing,
          width: 420,
          height: 380,
          borderRadius: radius,
          background: flat > 0 ? "none" : "#F1F2F5",
          border: borderMix,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...snap(p.image, 0, 26),
        }}
      >
        <div style={{ opacity: contentOpacity }}>
          <ProductGlyph kind={product} size={190} color={accent} />
        </div>
      </div>

      {/* thumbnail gallery row */}
      <div style={{ position: "absolute", left: spacing, top: 380 + spacing * 2, display: "flex", gap: spacing * 0.6, ...snap(p.gallery, 0, 14) }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 88,
              height: 88,
              borderRadius: radius * 0.6,
              background: flat > 0 ? "none" : "#F1F2F5",
              border: i === 0 ? `2px solid ${accent}` : borderMix || "1px solid rgba(11,17,28,0.08)",
            }}
          />
        ))}
      </div>

      {/* right column */}
      <div style={{ position: "absolute", left: 460 + spacing, top: spacing, width: CARD_W - 460 - spacing * 2 }}>
        <div style={{ ...snap(p.title, 20, 0), marginBottom: spacing * 0.7 }}>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight,
              fontSize: 30,
              color: flat > 0 ? "transparent" : COLORS.ink,
              border: flat > 0 ? borderMix : "none",
              borderRadius: 8,
              padding: flat > 0 ? "4px 0" : 0,
              opacity: contentOpacity + flat,
            }}
          >
            {title}
          </div>
          <div style={{ width: 340, height: 12, borderRadius: 6, background: flat > 0 ? "none" : "#EEEFF2", border: borderMix, marginTop: 12, opacity: contentOpacity + flat }} />
        </div>

        <div
          style={{
            ...snap(p.price, 20, 0),
            fontFamily: FONT_FAMILY,
            fontWeight,
            fontSize: 46,
            color: flat > 0 ? structColor : COLORS.ink,
            marginBottom: spacing * 0.6,
            opacity: contentOpacity + flat * 0.5,
          }}
        >
          {price}
        </div>

        <div style={{ ...snap(p.rating, 20, 0), display: "flex", gap: 6, alignItems: "center", marginBottom: spacing }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                background: i < Math.round(rating) ? accent : "#E4E6EB",
                opacity: flat > 0 ? contentOpacity : 1,
              }}
            />
          ))}
          <span style={{ fontFamily: FONT_FAMILY, fontSize: 20, color: "#6B7280", marginLeft: 8, opacity: contentOpacity }}>({reviewCount})</span>
        </div>

        <div style={{ ...snap(p.size, 20, 0), marginBottom: spacing }}>
          <div style={{ fontFamily: FONT_FAMILY, fontSize: 20, color: "#6B7280", marginBottom: 10, opacity: contentOpacity }}>Size</div>
          <div style={{ display: "flex", gap: 10 }}>
            {["7", "8", "9", "10", "11"].map((s, i) => (
              <div
                key={s}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: radius * 0.45,
                  border: i === 2 ? `2px solid ${accent}` : borderMix || "1px solid rgba(11,17,28,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  color: COLORS.ink,
                  opacity: contentOpacity + flat,
                }}
              >
                <span style={{ opacity: contentOpacity }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...snap(p.color, 20, 0), marginBottom: spacing * 1.1, display: "flex", gap: 12 }}>
          {[accent, "#D8DCE3", COLORS.midnight, "#F1F2F5"].map((c, i) => (
            <div key={i} style={{ width: 34, height: 34, borderRadius: 999, background: flat > 0 ? "none" : c, border: i === 0 ? `2px solid ${accent}` : borderMix }} />
          ))}
        </div>

        <div style={{ ...snap(p.cta, 20, 0), display: "flex", gap: 16 }}>
          <div
            style={{
              width: 130,
              height: 62,
              borderRadius: radius * 0.5,
              border: borderMix || "1px solid rgba(11,17,28,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_FAMILY,
              fontWeight: 700,
              fontSize: 22,
              color: COLORS.ink,
              opacity: contentOpacity + flat,
            }}
          >
            <span style={{ opacity: contentOpacity }}>1</span>
          </div>
          <div
            style={{
              flex: 1,
              height: 62,
              borderRadius: radius * 0.5,
              background: flat > 0 ? "none" : accent,
              border: borderMix,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_FAMILY,
              fontWeight,
              fontSize: 22,
              color: flat > 0 ? structColor : COLORS.white,
              opacity: flat > 0 ? contentOpacity + flat * 0.6 : 1,
            }}
          >
            <span style={{ opacity: flat > 0 ? contentOpacity : 1 }}>Add to Cart</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PDP_CARD_WIDTH = CARD_W;
export const PDP_CARD_HEIGHT = CARD_H;
