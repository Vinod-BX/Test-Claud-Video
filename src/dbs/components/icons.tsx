import React from "react";
import { GREY } from "../tokens";

export type ProductIconProps = {
  size: number;
  accent: string;
};

// Every icon is built from plain primitives (rect/circle/ellipse) rather than
// freehand illustration paths — flat, geometric, generic-premium placeholder
// products per the brief, never a recognizable/branded silhouette.

export const ShoeIcon: React.FC<ProductIconProps> = ({ size, accent }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 200 124" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="shoe-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={accent} />
        <stop offset="100%" stopColor={GREY[50]} />
      </linearGradient>
    </defs>
    {/* upper — heel tall at left, tapering to the toe at right */}
    <path
      d="M 14 78 C 14 46 34 24 70 20 C 104 16 134 26 156 46 C 168 57 176 64 180 70 L 180 86 C 180 93 174 97 166 97 L 30 97 C 18 97 14 89 14 78 Z"
      fill="url(#shoe-grad)"
    />
    {/* heel counter accent */}
    <path d="M 14 78 C 14 52 30 32 58 24 C 44 34 34 52 34 78 C 34 88 38 94 44 97 L 30 97 C 18 97 14 89 14 78 Z" fill={accent} opacity={0.55} />
    {/* laces */}
    {[0, 1, 2].map((i) => (
      <rect key={i} x={92 + i * 16} y={30 + i * 2} width="5" height="30" rx="2.5" fill={GREY[50]} opacity={0.9} transform={`rotate(28 ${94 + i * 16} 45)`} />
    ))}
    {/* sole */}
    <rect x="6" y="92" width="182" height="20" rx="10" fill={GREY[700]} />
    <rect x="6" y="92" width="182" height="8" rx="4" fill={GREY[500]} />
  </svg>
);

export const HeadphonesIcon: React.FC<ProductIconProps> = ({ size, accent }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible" }}>
    <path d="M 24 96 A 56 56 0 0 1 136 96" fill="none" stroke={GREY[600]} strokeWidth="12" strokeLinecap="round" />
    <rect x="8" y="86" width="32" height="52" rx="16" fill={accent} />
    <rect x="120" y="86" width="32" height="52" rx="16" fill={accent} opacity={0.82} />
  </svg>
);

export const WatchIcon: React.FC<ProductIconProps> = ({ size, accent }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible" }}>
    <rect x="58" y="4" width="44" height="26" rx="8" fill={GREY[300]} />
    <rect x="58" y="130" width="44" height="26" rx="8" fill={GREY[300]} />
    <rect x="38" y="38" width="84" height="84" rx="24" fill={accent} />
    <circle cx="80" cy="80" r="30" fill={GREY[50]} opacity={0.9} />
    <rect x="120" y="66" width="10" height="16" rx="4" fill={GREY[500]} />
  </svg>
);

export const CameraIcon: React.FC<ProductIconProps> = ({ size, accent }) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 180 130" style={{ overflow: "visible" }}>
    <rect x="46" y="12" width="46" height="20" rx="6" fill={GREY[600]} />
    <rect x="10" y="30" width="160" height="92" rx="20" fill={accent} />
    <circle cx="90" cy="76" r="34" fill={GREY[50]} opacity={0.92} />
    <circle cx="90" cy="76" r="20" fill={accent} />
    <rect x="140" y="44" width="16" height="12" rx="4" fill={GREY[50]} opacity={0.9} />
  </svg>
);

export const BackpackIcon: React.FC<ProductIconProps> = ({ size, accent }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" style={{ overflow: "visible" }}>
    <path d="M 46 34 Q 46 4 80 4 Q 114 4 114 34 L 114 50 L 46 50 Z" fill={GREY[400]} />
    <rect x="30" y="46" width="100" height="104" rx="26" fill={accent} />
    <rect x="52" y="90" width="56" height="42" rx="14" fill={GREY[50]} opacity={0.9} />
    <rect x="40" y="10" width="10" height="70" rx="5" fill={GREY[600]} />
    <rect x="110" y="10" width="10" height="70" rx="5" fill={GREY[600]} />
  </svg>
);

export type ProductKind = "shoe" | "headphones" | "watch" | "camera" | "backpack";

export const PRODUCT_ICONS: Record<ProductKind, React.FC<ProductIconProps>> = {
  shoe: ShoeIcon,
  headphones: HeadphonesIcon,
  watch: WatchIcon,
  camera: CameraIcon,
  backpack: BackpackIcon,
};
