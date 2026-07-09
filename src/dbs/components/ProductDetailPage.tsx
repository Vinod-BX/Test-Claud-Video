import React from "react";
import { interpolate, interpolateColors } from "remotion";
import { FONT_FAMILY, GREY, RADIUS, WHITE } from "../tokens";
import { enterProgress } from "../utils/timing";
import { PRODUCT_ICONS, ProductKind } from "./icons";

export type ProductDetailPageProps = {
  width: number;
  height: number;
  product: ProductKind;
  accent: string;
  price: string;
  ratingCount?: string;
  cornerRadius?: number;
  /** 0-1 — staged element-by-element reveal ("snapping into the grid"). */
  assembleProgress: number;
  /** 0-1 — every styled element crossfades into its grey wireframe twin. */
  skeletonProgress?: number;
  style?: React.CSSProperties;
};

const enter = (p: number, start: number, end: number) => enterProgress(p, start, end);

const SkeletonBar: React.FC<{ w: number; h: number; opacity: number; radius?: number }> = ({ w, h, opacity, radius = 4 }) =>
  opacity <= 0 ? null : (
    <div style={{ position: "absolute", inset: 0, width: w, height: h, borderRadius: radius, background: GREY[200], opacity }} />
  );

/**
 * The generic Product Detail Page — the single recurring object of Scene
 * 01. Reused verbatim across Shots 04-06: assembleProgress stages it into
 * existence, skeletonProgress dissolves it back into the shared wireframe
 * that closes the scene. Never a different component per state.
 */
export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  width,
  height,
  product,
  accent,
  price,
  ratingCount = "(201)",
  cornerRadius = RADIUS.xl,
  assembleProgress,
  skeletonProgress = 0,
  style,
}) => {
  const p = assembleProgress;
  const sk = skeletonProgress;
  const Icon = PRODUCT_ICONS[product];

  const topBar = enter(p, 0, 0.15);
  const image = enter(p, 0.08, 0.35);
  const thumbs = enter(p, 0.3, 0.45);
  const title = enter(p, 0.35, 0.48);
  const priceIn = enter(p, 0.45, 0.55);
  const rating = enter(p, 0.5, 0.6);
  const size = enter(p, 0.55, 0.7);
  const color = enter(p, 0.62, 0.76);
  const footer = enter(p, 0.78, 0.95);

  const neutralAccent = interpolateColors(sk, [0, 1], [accent as `#${string}`, GREY[300] as `#${string}`]);
  const neutralInk = interpolateColors(sk, [0, 1], [GREY.ink as `#${string}`, GREY[300] as `#${string}`]);

  const rise = (e: number) => ({
    opacity: e,
    transform: `translateY(${interpolate(e, [0, 1], [16, 0])}px) scale(${interpolate(e, [0, 1], [0.94, 1])})`,
  });

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: cornerRadius,
        background: WHITE,
        boxShadow: "0 50px 100px rgba(20, 22, 26, 0.14)",
        overflow: "hidden",
        fontFamily: FONT_FAMILY,
        ...style,
      }}
    >
      {/* top bar */}
      <div style={{ position: "absolute", top: 28, left: 28, right: 28, height: 20, display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(topBar) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: GREY[300] }} />
            <div style={{ width: 10, height: 10, borderRadius: 5, background: GREY[200] }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 60, height: 8, borderRadius: 4, background: GREY[150] }} />
            <div style={{ width: 34, height: 8, borderRadius: 4, background: GREY[150] }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${GREY[400]}` }} />
          <div style={{ width: 20, height: 18, borderRadius: "3px 3px 8px 8px", border: `2px solid ${GREY[400]}` }} />
        </div>
      </div>

      {/* image column */}
      <div
        style={{
          position: "absolute",
          top: 76,
          left: 28,
          width: width * 0.42,
          height: height * 0.56,
          borderRadius: RADIUS.lg,
          background: GREY[50],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...rise(image),
        }}
      >
        <div style={{ opacity: 1 - sk, transform: `rotate(-6deg) scale(${1 - sk * 0.1})` }}>
          <Icon size={width * 0.22} accent={accent} />
        </div>
        <SkeletonBar w={width * 0.42 - 40} h={height * 0.3} opacity={sk} radius={RADIUS.md} />
      </div>

      <div style={{ position: "absolute", top: 76 + height * 0.56 + 16, left: 28, display: "flex", gap: 10, ...rise(thumbs) }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: width * 0.42 * 0.2,
              height: width * 0.42 * 0.2,
              borderRadius: RADIUS.sm,
              background: GREY[50],
              border: i === 0 ? `2px solid ${neutralAccent}` : `1px solid ${GREY[150]}`,
            }}
          />
        ))}
      </div>

      {/* info column */}
      <div style={{ position: "absolute", top: 76, left: width * 0.52, right: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, ...rise(title) }}>
          <div style={{ width: "82%", height: 14, borderRadius: 7, background: GREY[150] }} />
          <div style={{ width: "56%", height: 14, borderRadius: 7, background: GREY[150] }} />
        </div>

        <div style={{ position: "relative", height: 44, marginTop: 26, ...rise(priceIn) }}>
          <div style={{ position: "absolute", inset: 0, fontSize: 30, fontWeight: 800, color: neutralInk, opacity: 1 - sk }}>{price}</div>
          <SkeletonBar w={110} h={22} opacity={sk} radius={6} />
        </div>

        <div style={{ position: "relative", height: 24, marginTop: 18, display: "flex", alignItems: "center", gap: 10, ...rise(rating) }}>
          <div style={{ display: "flex", gap: 3, opacity: 1 - sk }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ width: 14, height: 14, background: i < 4 ? neutralAccent : GREY[200], clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
            ))}
          </div>
          <span style={{ fontSize: 16, color: GREY[500], opacity: 1 - sk }}>{ratingCount}</span>
          <SkeletonBar w={90} h={16} opacity={sk} radius={6} />
        </div>

        <div style={{ marginTop: 28, ...rise(size) }}>
          <div style={{ fontSize: 15, color: GREY[500], marginBottom: 10, opacity: 1 - sk * 0.4 }}>Size</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["7", "8", "9", "10", "11"].map((s, i) => (
              <div
                key={s}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: RADIUS.sm,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  background: i === 2 ? neutralAccent : WHITE,
                  color: i === 2 ? WHITE : GREY[500],
                  border: i === 2 ? "none" : `1px solid ${GREY[200]}`,
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24, ...rise(color) }}>
          <div style={{ fontSize: 15, color: GREY[500], marginBottom: 10, opacity: 1 - sk * 0.4 }}>Color</div>
          <div style={{ display: "flex", gap: 10 }}>
            {["#F2C9B3", GREY[300], accent, GREY[700]].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  background: interpolateColors(sk, [0, 1], [c as `#${string}`, GREY[300] as `#${string}`]),
                  boxShadow: i === 0 ? `0 0 0 2px ${WHITE}, 0 0 0 3px ${neutralAccent}` : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 4, left: 0, right: 0, display: "flex", gap: 14, ...rise(footer) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 14px", height: 52, borderRadius: RADIUS.pill, border: `1px solid ${GREY[200]}`, fontSize: 16, color: GREY[600] }}>
            <span>−</span>
            <span>1</span>
            <span>+</span>
          </div>
          <div
            style={{
              flex: 1,
              height: 52,
              borderRadius: RADIUS.pill,
              background: neutralAccent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: WHITE,
              fontWeight: 700,
              fontSize: 17,
              opacity: 1 - sk * 0.15,
            }}
          >
            <span style={{ opacity: 1 - sk }}>Add to Cart</span>
          </div>
        </div>
      </div>
    </div>
  );
};
