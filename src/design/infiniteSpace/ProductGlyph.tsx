import React from "react";

export type ProductKind = "shoe" | "headphones" | "watch";

export type ProductGlyphProps = {
  kind: ProductKind;
  size: number;
  color: string;
};

// Flat single-color vector marks, not photoreal renders — keeps the PDP a
// component-style UI object (the thing being restyled) rather than a stock
// product photo (the thing that would distract from the restyling itself).
const PATHS: Record<ProductKind, string> = {
  shoe: "M6 62c0-9 7-14 16-15l30-3c9-1 14-6 21-13 5-5 12-8 19-6 5 1 7 6 5 11l-4 9c14 1 24 6 24 14 0 7-8 11-20 11H20c-8 0-14-3-14-9z",
  headphones:
    "M50 14c-22 0-38 17-38 38v22a9 9 0 0 0 9 9h6a9 9 0 0 0 9-9V60a9 9 0 0 0-9-9h-5c1-16 13-28 28-28s27 12 28 28h-5a9 9 0 0 0-9 9v14a9 9 0 0 0 9 9h6a9 9 0 0 0 9-9V52c0-21-16-38-38-38z",
  watch:
    "M38 22h24l3 12H35zM38 78h24l3-12H35zM22 44a28 28 0 1 1 0 12 28 28 0 0 1 0-12zm28-14a20 20 0 1 0 0 40 20 20 0 0 0 0-40zm0 8v13l10 6",
};

export const ProductGlyph: React.FC<ProductGlyphProps> = ({ kind, size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ display: "block" }}>
    <path
      d={PATHS[kind]}
      fill={kind === "watch" ? "none" : color}
      stroke={color}
      strokeWidth={kind === "watch" ? 5 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
