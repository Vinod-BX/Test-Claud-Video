import { COLORS, RADIUS } from "../tokens";
import { ProductKind } from "./ProductGlyph";

export type PdpVariation = {
  product: ProductKind;
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  accent: string;
  radius: number;
  fontWeight: number;
  spacing: number;
};

// Three restyles of the identical PDP structure — same regions, same order,
// only the styling changes. Numbers are illustrative retail figures, not
// tied to any real product.
export const PDP_VARIATIONS: PdpVariation[] = [
  {
    product: "shoe",
    title: "Aero Runner",
    price: "$129.00",
    rating: 4.5,
    reviewCount: 207,
    accent: "#FF6B4A",
    radius: RADIUS.sm,
    fontWeight: 700,
    spacing: 16,
  },
  {
    product: "headphones",
    title: "Studio Fold",
    price: "$199.00",
    rating: 4.2,
    reviewCount: 89,
    accent: COLORS.deepViolet,
    radius: RADIUS.lg,
    fontWeight: 800,
    spacing: 28,
  },
  {
    product: "watch",
    title: "Pulse Series 4",
    price: "$249.00",
    rating: 4.4,
    reviewCount: 64,
    accent: "#1FAE7A",
    radius: RADIUS.pill,
    fontWeight: 600,
    spacing: 12,
  },
];
