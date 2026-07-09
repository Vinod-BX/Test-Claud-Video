import React from "react";
import { Easing, interpolate } from "remotion";
import { ACCENT, FONT_FAMILY, GREY, RADIUS, TYPE_SCALE, WHITE } from "../tokens";

export type RulesPanelProps = {
  /** 0-1 across the whole panel — each row reveals in its own staggered slice. */
  progress: number;
  width: number;
  style?: React.CSSProperties;
};

const ROWS: Array<{ label: string; active: boolean; render: (active: boolean) => React.ReactNode }> = [
  {
    label: "Color",
    active: true,
    render: () => (
      <div style={{ display: "flex", gap: 8 }}>
        {[ACCENT, "#7C5CFC", "#2FBE83", "#FFB23E", GREY[300]].map((c, i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: 6, background: c }} />
        ))}
      </div>
    ),
  },
  {
    label: "Typography",
    active: false,
    render: () => (
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, color: GREY[600] }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>Aa</span>
        <span style={{ fontSize: TYPE_SCALE.micro, fontWeight: 500 }}>Inter</span>
      </div>
    ),
  },
  {
    label: "Spacing",
    active: false,
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {[16, 28, 44].map((w, i) => (
          <div key={i} style={{ width: w, height: 8, borderRadius: 4, background: GREY[300] }} />
        ))}
      </div>
    ),
  },
  {
    label: "Grid",
    active: false,
    render: () => (
      <div style={{ display: "flex", gap: 5 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ width: 8, height: 26, borderRadius: 3, background: GREY[200] }} />
        ))}
      </div>
    ),
  },
  {
    label: "Radius",
    active: false,
    render: () => (
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 8, 16].map((r, i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: r, background: WHITE, border: `2px solid ${GREY[300]}` }} />
        ))}
      </div>
    ),
  },
  {
    label: "Elevation",
    active: false,
    render: () => (
      <div style={{ width: 96, height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${GREY[100]}, ${GREY[500]})` }} />
    ),
  },
];

const rowWindow = (index: number, total: number): [number, number] => {
  const span = 1 / total;
  const start = index * span * 0.75;
  return [start, start + span * 1.6];
};

/**
 * The design-token property sheet from Shot 03 — "rules before screens".
 * Rows reveal one at a time, growing outward from the token rather than
 * popping in together.
 */
export const RulesPanel: React.FC<RulesPanelProps> = ({ progress, width, style }) => {
  return (
    <div
      style={{
        width,
        borderRadius: RADIUS.xl,
        background: WHITE,
        boxShadow: "0 40px 80px rgba(20, 22, 26, 0.08)",
        padding: 36,
        display: "flex",
        flexDirection: "column",
        gap: 26,
        ...style,
      }}
    >
      {ROWS.map((row, i) => {
        const [start, end] = rowWindow(i, ROWS.length);
        const local = interpolate(progress, [start, end], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        if (local <= 0) {
          return <div key={row.label} style={{ height: 26 }} />;
        }
        const color = row.active ? ACCENT : GREY[400];
        return (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: local,
              transform: `translateX(${interpolate(local, [0, 1], [-18, 0])}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, width: 168, flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 600,
                  fontSize: TYPE_SCALE.label,
                  color,
                }}
              >
                {row.label}
              </span>
            </div>
            {row.render(row.active)}
          </div>
        );
      })}
    </div>
  );
};
