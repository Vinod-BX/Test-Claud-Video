import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { ACCENT_SOFT, GREY, WHITE } from "../tokens";
import { seededRandom } from "../utils/timing";

const CELL = 40;
const TILE_CELLS = 16;
const TILE = CELL * TILE_CELLS;
const PLANE_SIZE = 5200;

const PASTELS = [ACCENT_SOFT, "#FBE4EC", "#E3F5EC", "#FFF3DD", "#EFE6FB"];

type Cell = { x: number; y: number; fill: string };

// Fixed-seed "supertile" of coloured pixels — computed once at module scope
// (never per-frame) so every render of every frame sees the identical floor.
const buildTileCells = (): Cell[] => {
  const rand = seededRandom(1337);
  const cells: Cell[] = [];
  for (let row = 0; row < TILE_CELLS; row++) {
    for (let col = 0; col < TILE_CELLS; col++) {
      const roll = rand();
      let fill: string = GREY[100];
      if (roll > 0.94) {
        fill = PASTELS[Math.floor(rand() * PASTELS.length)];
      } else if (roll > 0.8) {
        fill = GREY[150];
      } else if (roll > 0.6) {
        fill = GREY[50];
      }
      cells.push({ x: col * CELL, y: row * CELL, fill });
    }
  }
  return cells;
};

const TILE_CELLS_DATA = buildTileCells();

export type ConstructionGridProps = {
  frame: number;
  /** 0 = flat/frontal (no floor read), ~68 = full receding-floor perspective. */
  tiltDeg: number;
  /** Overall zoom of the floor plane, independent of foreground camera scale. */
  planeScale?: number;
  opacity?: number;
  blurPx?: number;
  /** Phase-shifts the drift so multiple mounts never look synced. */
  driftSeed?: number;
  /** Extra content placed inside the SAME tilted plane, so it inherits the
   * floor's perspective foreshortening for free (used by Shot 06's card field). */
  children?: React.ReactNode;
};

/**
 * The infinite construction-grid floor — the one background motif every
 * shot in Scene 01 shares. Built as a single SVG pattern tile (not thousands
 * of DOM nodes) for performance; the "thousands of aligned pixels" read is
 * an illusion of a repeating 16x16 supertile.
 */
export const ConstructionGrid: React.FC<ConstructionGridProps> = ({
  frame,
  tiltDeg,
  planeScale = 1,
  opacity = 1,
  blurPx = 0,
  driftSeed = 0,
  children,
}) => {
  const driftX = (frame * 0.32 + driftSeed) % TILE;
  const driftY = (frame * 0.2 + driftSeed * 1.6) % TILE;

  const tileRects = useMemo(
    () =>
      TILE_CELLS_DATA.map((cell, i) => (
        <rect key={i} x={cell.x} y={cell.y} width={CELL - 6} height={CELL - 6} fill={cell.fill} />
      )),
    [],
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity, filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, perspective: 1400 }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "58%",
            width: PLANE_SIZE,
            height: PLANE_SIZE,
            marginLeft: -PLANE_SIZE / 2,
            marginTop: -PLANE_SIZE / 2,
            transform: `rotateX(${tiltDeg}deg) scale(${planeScale})`,
            transformOrigin: "50% 50%",
          }}
        >
          <svg width={PLANE_SIZE} height={PLANE_SIZE} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <pattern
                id="dbs-grid-tile"
                width={TILE}
                height={TILE}
                patternUnits="userSpaceOnUse"
                patternTransform={`translate(${-driftX}, ${-driftY})`}
              >
                {tileRects}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dbs-grid-tile)" />
          </svg>

          {children && (
            <div
              style={{
                position: "absolute",
                left: PLANE_SIZE / 2,
                top: PLANE_SIZE / 2,
                width: 0,
                height: 0,
              }}
            >
              {children}
            </div>
          )}
        </div>
      </div>

      {/* atmospheric fog toward the horizon, and a floor for the near edge */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, ${WHITE} 0%, rgba(255,255,255,0) 34%, rgba(255,255,255,0) 66%, ${WHITE} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const GRID_PLANE_SIZE = PLANE_SIZE;
