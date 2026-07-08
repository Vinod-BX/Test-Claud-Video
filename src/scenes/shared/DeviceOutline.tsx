import { evolvePath } from "@remotion/paths";
import { makeRect } from "@remotion/shapes";
import React, { useMemo } from "react";
import { COLORS, FONT_FAMILY } from "../../design/tokens";

export type DeviceKind = "code" | "mobile" | "web" | "ai";

export type DeviceOutlineProps = {
  kind: DeviceKind;
  label: string;
  size?: number;
  accent?: string;
  /** 0-1 draw-on progress */
  progress: number;
};

// Generic, non-trademarked glyphs standing in for "React" / "Flutter" / "Web"
// / "AI" — deliberately abstract shapes, not real product logos (none were
// supplied, and using real third-party marks would be a trademark risk).
export const DeviceOutline: React.FC<DeviceOutlineProps> = ({ kind, label, size = 96, accent = COLORS.deepViolet, progress }) => {
  const glyphPath = useMemo(() => {
    if (kind === "mobile") {
      return makeRect({ width: size * 0.5, height: size, cornerRadius: size * 0.14 }).path;
    }
    if (kind === "web") {
      return makeRect({ width: size, height: size * 0.72, cornerRadius: size * 0.08 }).path;
    }
    if (kind === "ai") {
      // abstract diamond, deliberately not a sparkle/starburst
      const half = size / 2;
      return `M ${half} 0 L ${size} ${half} L ${half} ${size} L 0 ${half} Z`;
    }
    // code: a simple </> chevron pair
    return `M ${size * 0.32} ${size * 0.22} L ${size * 0.06} ${size * 0.5} L ${size * 0.32} ${size * 0.78} M ${size * 0.68} ${size * 0.22} L ${size * 0.94} ${size * 0.5} L ${size * 0.68} ${size * 0.78}`;
  }, [kind, size]);

  const { strokeDasharray, strokeDashoffset } = useMemo(() => evolvePath(progress, glyphPath), [progress, glyphPath]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.18 }}>
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        <path
          d={glyphPath}
          fill="none"
          stroke={accent}
          strokeWidth={size * 0.045}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: size * 0.22,
          color: COLORS.ink,
          opacity: progress,
        }}
      >
        {label}
      </div>
    </div>
  );
};
