import React from "react";
import { FONT_FAMILY, TYPE_SCALE } from "./tokens";
import { Token } from "./Token";

// PLACEHOLDER LOGO — the client's "bounteous" wordmark was only shared as a
// rendered image, not a usable vector/raster file. Once the actual SVG/PNG
// arrives, replace this component's contents with:
//   <Img src={staticFile("logo.svg")} style={{ height: size }} />
export const BrandMark: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <Token size={size} cornerRadius={size * 0.28} />
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 800,
          fontSize: size * 0.62,
          color: "#0B111C",
          letterSpacing: "-0.01em",
        }}
      >
        bounteous
      </span>
    </div>
  );
};

export const BRAND_MARK_LABEL_SIZE = TYPE_SCALE.label;
