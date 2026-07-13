import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GridField } from "../../design/infiniteSpace/GridField";
import { PDPCard } from "../../design/infiniteSpace/PDPCard";
import { PDP_VARIATIONS } from "../../design/infiniteSpace/variations";
import { COLORS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../../design/tokens";
import { useNunitoSansLoaded } from "../../design/fonts";
import { VariablePill } from "../shared/VariablePill";

// Google Material's three canonical curves — used instead of ad-hoc easings
// so every beat reads as "Material Motion", per the shot brief.
const STANDARD = Easing.bezier(0.4, 0, 0.2, 1);
const DECELERATE = Easing.bezier(0, 0, 0.2, 1);
const ACCELERATE = Easing.bezier(0.4, 0, 1, 1);

// Shot boundaries, in frames @ 30fps. Shots 1-5 keep the brief's stated
// timing; Shot 6 is the closing beat that extends the piece to a full 20s.
const S1_END = 90; // 0:00-0:03 Infinite Design Space
const S2_END = 150; // 0:03-0:05 One Pixel Becomes Meaningful
const S3_END = 240; // 0:05-0:08 Rules Before Screens
const S4_END = 330; // 0:08-0:11 PDP Assembles From the System
const S5_END = 420; // 0:11-0:14 Rebuilt. Again. And Again.
const TOTAL = 600; // 0:14-0:20 closing: identity loss -> return to the grid

const wp = (frame: number, start: number, end: number, easing = STANDARD): number =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

const ACCENT = COLORS.electricBlue;

const HERO_CARD_W = 900;
const HERO_LEFT = VIDEO_WIDTH / 2 - HERO_CARD_W / 2;
const HERO_TOP = VIDEO_HEIGHT / 2 - 310;

const GRID_COLS = 5;
const GRID_ROWS = 3;
const MINI_W = 250;
const MINI_GAP = 40;
const MINI_H = (620 * MINI_W) / 900;
const GRID_TOTAL_W = GRID_COLS * MINI_W + (GRID_COLS - 1) * MINI_GAP;
const GRID_TOTAL_H = GRID_ROWS * MINI_H + (GRID_ROWS - 1) * MINI_GAP;
const GRID_LEFT = VIDEO_WIDTH / 2 - GRID_TOTAL_W / 2;
const GRID_TOP = VIDEO_HEIGHT / 2 - GRID_TOTAL_H / 2;
const HERO_SLOT = { col: 2, row: 1 }; // lands exactly on screen-center, matching the hero card's resting position

const slotPosition = (col: number, row: number) => ({
  left: GRID_LEFT + col * (MINI_W + MINI_GAP),
  top: GRID_TOP + row * (MINI_H + MINI_GAP),
});

/**
 * "Infinite Design Space" — a continuous, uncut 20s piece: an endless
 * construction grid resolves into one pixel, which becomes a design token,
 * then a layout system, then a product page, then dozens of restyled
 * product pages, which all shed their identity together and dissolve back
 * into the same grid they came from. See CLAUDE.md / rules/art-direction.md
 * for the standing brief this follows.
 */
export const InfiniteDesignSpace: React.FC = () => {
  useNunitoSansLoaded();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Shot 1: the establishing grid + push into the highlighted pixel ----
  const heroGridOpacity = 1 - wp(frame, 95, 128);
  const heroTilt = wp(frame, 0, 24, DECELERATE);
  const heroPan = interpolate(frame, [0, S1_END], [0, 1], { extrapolateRight: "clamp" });
  const highlightIn = wp(frame, 22, 56, DECELERATE);
  const highlightOut = 1 - wp(frame, 92, 112);
  const pushScale = 1 + wp(frame, 56, 92, ACCELERATE) * 40;
  const pushBlur = interpolate(frame, [70, 88, 106], [0, 16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const heroHighlights = [{ col: 14, row: 9, progress: Math.min(highlightIn, highlightOut), color: ACCENT }];

  // ---- Shot 2: the pixel expands into a token; foundations ripple out ----
  const veilOpacity = wp(frame, 82, 92) * (1 - wp(frame, 100, 128));
  const tokenSize = interpolate(frame, [88, 136], [2600, 230], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DECELERATE,
  });
  const tokenSettle = spring({ frame: frame - 128, fps, config: { damping: 13, mass: 0.55 } });
  const tokenDissolve = 1 - wp(frame, 158, 176);
  const foundationsIn = wp(frame, 130, 190);
  const foundationsOut = 1 - wp(frame, 226, 246);
  const foundations = Math.min(foundationsIn, foundationsOut);

  const ambientOpacity =
    wp(frame, 108, 150) * (1 - wp(frame, 400, 420)) * 0.06 +
    wp(frame, 420, 460) * 0.16 +
    (frame > 460 ? interpolate(frame, [460, 560], [0, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0);
  const ambientTilt = interpolate(frame, [S2_END, S5_END, TOTAL], [0, 0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ambientPan = interpolate(frame, [0, TOTAL], [0.3, 1.4]);
  const ambientPulse =
    frame > 566 ? interpolate(Math.sin(((frame - 566) / 26) * Math.PI * 2), [-1, 1], [0.35, 0.85]) : 0;

  // ---- Shot 3: the PDP assembles from the same layout rules ----
  const heroAssemblyFrame = frame - 168;
  const heroVariation = PDP_VARIATIONS[0];

  // ---- Shot 4: same structure, restyled — three variations, accelerating ----
  const variationWindows: [number, number][] = [
    [S3_END, S3_END + 46],
    [S3_END + 40, S3_END + 72],
    [S3_END + 66, S4_END],
  ];
  const variationOpacity = (i: number) => {
    if (frame < S3_END) return i === 0 ? 1 : 0;
    const [start, end] = variationWindows[i];
    const fadeIn = wp(frame, start, start + 8);
    const fadeOut = 1 - wp(frame, end - 8, end + 8);
    return Math.min(fadeIn, i === variationWindows.length - 1 ? 1 : fadeOut);
  };

  // ---- Shot 5: the hero card settles into a field of a dozen siblings ----
  const heroToSlot = spring({ frame: frame - S4_END, fps, config: { damping: 15, mass: 0.7 } });
  const heroLeft = interpolate(heroToSlot, [0, 1], [HERO_LEFT, slotPosition(HERO_SLOT.col, HERO_SLOT.row).left]);
  const heroTop = interpolate(heroToSlot, [0, 1], [HERO_TOP, slotPosition(HERO_SLOT.col, HERO_SLOT.row).top]);
  const heroWidth = interpolate(heroToSlot, [0, 1], [HERO_CARD_W, MINI_W]);

  // ---- Shot 6: every page loses its identity at once, then rejoins the grid ----
  const identityProgress = wp(frame, S5_END, S5_END + 40);
  const fieldFadeOut = 1 - wp(frame, S5_END + 40, 560);
  const collapseScale = interpolate(frame, [S5_END + 40, 560], [1, 0.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ACCELERATE,
  });

  const slots = useMemo(() => {
    const out: { col: number; row: number }[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (col === HERO_SLOT.col && row === HERO_SLOT.row) continue;
        out.push({ col, row });
      }
    }
    return out;
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white, overflow: "hidden", fontFamily: "inherit" }}>
      {/* Shot 1: the calm, endless grid */}
      {heroGridOpacity > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: heroGridOpacity, transform: `scale(${pushScale})`, filter: pushBlur > 0.5 ? `blur(${pushBlur}px)` : undefined }}>
          <GridField cols={28} rows={18} cellSize={72} panProgress={heroPan} tiltProgress={heroTilt} opacity={0.9} highlights={heroHighlights} />
        </div>
      )}

      {/* Shot 2: the accent veil (still filling the frame from the push) recedes into a token */}
      {veilOpacity > 0 && <AbsoluteFill style={{ backgroundColor: ACCENT, opacity: veilOpacity }} />}

      {tokenSettle > 0.01 && tokenDissolve > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: VIDEO_WIDTH / 2 - tokenSize / 2,
            top: VIDEO_HEIGHT / 2 - tokenSize / 2,
            width: tokenSize,
            height: tokenSize,
            borderRadius: tokenSize * 0.16,
            background: ACCENT,
            opacity: tokenDissolve,
            transform: `scale(${0.9 + tokenSettle * 0.1})`,
            boxShadow: frame > 150 ? `0 0 40px 6px ${ACCENT}44` : undefined,
          }}
        />
      )}

      {/* Layout foundations rippling outward from the token */}
      {foundations > 0 && (
        <AbsoluteFill style={{ opacity: foundations }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const local = wp(frame, 132 + i * 5, 160 + i * 5, DECELERATE);
            const x = (VIDEO_WIDTH / 7) * (i + 1);
            return (
              <div key={`col-${i}`} style={{ position: "absolute", left: x, top: VIDEO_HEIGHT * (1 - local) * 0.5, bottom: VIDEO_HEIGHT * (1 - local) * 0.5, width: 1, background: COLORS.midnight, opacity: 0.1 }} />
            );
          })}
          {[0.32, 0.4, 0.48].map((rowFrac, i) => {
            const local = wp(frame, 140 + i * 6, 168 + i * 6, DECELERATE);
            return (
              <div
                key={`type-${i}`}
                style={{
                  position: "absolute",
                  left: VIDEO_WIDTH / 2 - 90 * local,
                  top: VIDEO_HEIGHT * rowFrac,
                  width: 180 * local,
                  height: 10,
                  borderRadius: 5,
                  background: COLORS.deepViolet,
                  opacity: 0.5,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: VIDEO_WIDTH / 2 - 80, top: VIDEO_HEIGHT * 0.62, display: "flex", gap: 14 }}>
            {["spacing/16", "grid/6-col", "color/primary"].map((label, i) => {
              const local = wp(frame, 150 + i * 8, 176 + i * 8, DECELERATE);
              if (local <= 0) return null;
              return <VariablePill key={label} label={label} progress={local} accent={COLORS.deepViolet} fontSize={20} />;
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* Ambient construction grid — the faint, persistent floor beneath every product page, and what everything dissolves back into */}
      {ambientOpacity > 0.001 && (
        <GridField cols={30} rows={17} cellSize={80} panProgress={ambientPan} tiltProgress={ambientTilt} opacity={ambientOpacity} highlights={frame > 566 ? [{ col: 15, row: 8, progress: ambientPulse, color: ACCENT }] : []} />
      )}

      {/* Shot 3-4: one PDP, assembling then restyling in place */}
      {frame >= S2_END - 4 && frame < S4_END + 20 && (
        <AbsoluteFill style={{ opacity: 1 - wp(frame, S4_END + 4, S4_END + 20) }}>
          {frame < S3_END && (
            <div style={{ position: "absolute", left: HERO_LEFT, top: HERO_TOP }}>
              <PDPCard variation={heroVariation} frame={heroAssemblyFrame} fps={fps} width={HERO_CARD_W} />
            </div>
          )}
          {frame >= S3_END &&
            PDP_VARIATIONS.map((variation, i) => {
              const o = variationOpacity(i);
              if (o <= 0) return null;
              return (
                <div key={variation.title} style={{ position: "absolute", left: HERO_LEFT, top: HERO_TOP, opacity: o }}>
                  <PDPCard variation={variation} frame={999} fps={fps} width={HERO_CARD_W} />
                </div>
              );
            })}
        </AbsoluteFill>
      )}

      {/* Shot 5-6: the hero settles into a field of restyled siblings, all of which then flatten together */}
      {frame >= S4_END && (
        <>
          <div
            style={{
              position: "absolute",
              left: heroLeft,
              top: heroTop,
              transform: `scale(${collapseScale})`,
              transformOrigin: "center",
              opacity: fieldFadeOut,
            }}
          >
            <PDPCard variation={PDP_VARIATIONS[0]} frame={999} fps={fps} width={heroWidth} identityProgress={identityProgress} />
          </div>

          {slots.map(({ col, row }, i) => {
            const { left, top } = slotPosition(col, row);
            const arriveDelay = S4_END + 10 + i * 4;
            const arriveProgress = wp(frame, arriveDelay, arriveDelay + 18, DECELERATE);
            if (arriveProgress <= 0) return null;
            const variation = PDP_VARIATIONS[(i + 1) % PDP_VARIATIONS.length];
            return (
              <div
                key={`${col}-${row}`}
                style={{
                  position: "absolute",
                  left,
                  top,
                  opacity: arriveProgress * fieldFadeOut,
                  transform: `translateY(${(1 - arriveProgress) * 18}px) scale(${collapseScale})`,
                  transformOrigin: "center",
                }}
              >
                <PDPCard variation={variation} frame={frame - arriveDelay} fps={fps} width={MINI_W} identityProgress={identityProgress} />
              </div>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};

export const INFINITE_DESIGN_SPACE_DURATION = TOTAL;
