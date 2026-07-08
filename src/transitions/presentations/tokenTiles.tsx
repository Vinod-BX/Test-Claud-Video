import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BRAND_GRADIENT_STOPS } from "../../design/tokens";

type TokenTilesProps = Record<string, never>;

const COLS = 8;
const ROWS = 5;

/**
 * S4 -> S5. Scene 4 ends mid-token-generation; this literalizes it — a grid
 * of Token-gradient tiles (one generated pattern, many outputs) covers the
 * frame then scales away tile-by-tile in a staggered wave, revealing the
 * cross-platform generation scene underneath.
 */
const TokenTilesPresentation: React.FC<TransitionPresentationComponentProps<TokenTilesProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const tiles = useMemo(() => {
    const arr: { row: number; col: number; delay: number; color: string }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const delay = ((row + col) / (ROWS + COLS)) * 0.55;
        const color = BRAND_GRADIENT_STOPS[(row + col) % BRAND_GRADIENT_STOPS.length];
        arr.push({ row, col, delay, color });
      }
    }
    return arr;
  }, []);

  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
        {tiles.map(({ row, col, delay, color }) => {
          const localProgress = interpolate(presentationProgress, [delay, Math.min(delay + 0.45, 1)], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={`${row}-${col}`}
              style={{
                background: color,
                transform: `scale(${1 - localProgress})`,
                opacity: 1 - localProgress,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const tokenTiles = (props: TokenTilesProps = {}): TransitionPresentation<TokenTilesProps> => ({
  component: TokenTilesPresentation,
  props,
});
