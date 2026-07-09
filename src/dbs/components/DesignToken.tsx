import React from "react";
import { ACCENT } from "../tokens";

export type DesignTokenProps = {
  size: number;
  /** 0-1 — soft elevation glow, per the storyboard's halo around the pixel. */
  glow?: number;
  /** 0-1 — Figma-style dashed corner-bracket selection indicator. */
  selected?: number;
  style?: React.CSSProperties;
};

/**
 * The single recurring token object (Shot 02) — never replaced, only
 * recomposed: it is the seed that Shot 03's rules grow out of and the
 * anchor the camera pushes toward.
 */
export const DesignToken: React.FC<DesignTokenProps> = ({ size, glow = 0, selected = 0, style }) => {
  const bracketOffset = size * 0.22;
  const bracketLength = size * 0.24;

  return (
    <div style={{ position: "relative", width: size, height: size, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size * 0.22,
          background: ACCENT,
          boxShadow: glow > 0 ? `0 0 ${glow * 60}px ${glow * 22}px rgba(47, 99, 255, ${0.32 * glow})` : undefined,
        }}
      />

      {selected > 0 &&
        (
          [
            { top: -bracketOffset, left: -bracketOffset, bottom: undefined, right: undefined, borders: "tl" },
            { top: -bracketOffset, right: -bracketOffset, bottom: undefined, left: undefined, borders: "tr" },
            { bottom: -bracketOffset, left: -bracketOffset, top: undefined, right: undefined, borders: "bl" },
            { bottom: -bracketOffset, right: -bracketOffset, top: undefined, left: undefined, borders: "br" },
          ] as const
        ).map((corner) => (
          <div
            key={corner.borders}
            style={{
              position: "absolute",
              top: corner.top,
              bottom: corner.bottom,
              left: corner.left,
              right: corner.right,
              width: bracketLength,
              height: bracketLength,
              opacity: selected,
              borderTop: corner.borders === "tl" || corner.borders === "tr" ? `2px dashed ${ACCENT}` : undefined,
              borderLeft: corner.borders === "tl" || corner.borders === "bl" ? `2px dashed ${ACCENT}` : undefined,
              borderBottom: corner.borders === "bl" || corner.borders === "br" ? `2px dashed ${ACCENT}` : undefined,
              borderRight: corner.borders === "tr" || corner.borders === "br" ? `2px dashed ${ACCENT}` : undefined,
            }}
          />
        ))}
    </div>
  );
};
