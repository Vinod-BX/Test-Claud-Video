import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { ConstructionGrid } from "../components/ConstructionGrid";
import { DesignToken } from "../components/DesignToken";
import { ProductDetailPage } from "../components/ProductDetailPage";
import { RulesPanel } from "../components/RulesPanel";
import { StructureGrid } from "../components/StructureGrid";
import { ProductKind } from "../components/icons";
import { ACCENT, VIDEO_HEIGHT, VIDEO_WIDTH } from "../tokens";
import { seededRandom } from "../utils/timing";

// Shot boundaries, as fractions of the scene — mirrors the 0:00/0:03/0:05/
// 0:08/0:11/0:14/0:15 script timestamps so the ratios hold at any fps/duration.
const B1 = 3 / 15; // Shot 01 -> 02 — pixel starts glowing
const B2 = 5 / 15; // Shot 02 -> 03 — token expands into rules
const B3 = 8 / 15; // Shot 03 -> 04 — rules attract the PDP
const B4 = 11 / 15; // Shot 04 -> 05 — page begins rebuilding
const B5 = 14 / 15; // Shot 05 -> 06 — pullback into the duplication field

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

type DuplicateCard = { x: number; y: number; scale: number; rotation: number; product: ProductKind; accent: string; delay: number };

const DUPLICATE_PALETTE = ["#FF5A46", "#7C5CFC", "#2FBE83", "#FFA23E", "#2FB6BE", "#E85DA0"];
const DUPLICATE_PRODUCTS: ProductKind[] = ["shoe", "headphones", "watch", "camera", "backpack"];

const buildDuplicateField = (): DuplicateCard[] => {
  const rand = seededRandom(4242);
  const cards: DuplicateCard[] = [];
  const cols = 6;
  const rows = 4;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const depth = row / (rows - 1); // 0 = nearest, 1 = furthest
      cards.push({
        x: (col - (cols - 1) / 2) * 430 + (rand() - 0.5) * 60,
        y: -depth * 1700 - 120 + (rand() - 0.5) * 50,
        scale: interpolate(depth, [0, 1], [1, 0.52]),
        rotation: (rand() - 0.5) * 4,
        product: DUPLICATE_PRODUCTS[Math.floor(rand() * DUPLICATE_PRODUCTS.length)],
        accent: DUPLICATE_PALETTE[Math.floor(rand() * DUPLICATE_PALETTE.length)],
        delay: rand() * 0.08,
      });
    }
  }
  return cards;
};

const DUPLICATE_FIELD = buildDuplicateField();

export const Scene01DesignGetsRebuilt: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;

  // ---- Shared floor / camera --------------------------------------------
  const tiltDeg = interpolate(progress, [0, B1, B2, B3, B4, B5, 1], [68, 68, 24, 14, 10, 52, 66], clampOpts);
  const gridOpacity = interpolate(
    progress,
    [0, B1, B1 + 0.05, B2, B3, B4, B4 + 0.1, B5, 1],
    [0.85, 0.85, 0.4, 0.12, 0.07, 0.06, 0.16, 0.5, 0.55],
    clampOpts,
  );
  const gridBlur = interpolate(progress, [0, B1, B1 + 0.06, B1 + 0.1, B2, B4, B4 + 0.05, B5], [0, 0, 5, 2, 0, 0, 3, 0], clampOpts);

  // ---- Shot 02 — the token ------------------------------------------------
  const tokenGrow = interpolate(progress, [B1 - 0.03, B2], [0, 1], { ...clampOpts, easing: ease });
  const tokenGlow = interpolate(progress, [B1 - 0.03, B1 + 0.05], [0, 1], clampOpts);
  const tokenSelected = interpolate(progress, [B1 + 0.06, B1 + 0.14], [0, 1], clampOpts);
  const tokenOpacity = interpolate(progress, [B1 - 0.05, B1 - 0.01, B2 + 0.05, B3 - 0.05], [0, 1, 1, 0], clampOpts);
  const tokenSize = interpolate(tokenGrow, [0, 1], [22, 210]);

  // ---- Shot 03 — rules + structure ---------------------------------------
  const systemOpacity = interpolate(progress, [B2 - 0.02, B2 + 0.06, B3 + 0.03, B3 + 0.12], [0, 1, 1, 0], clampOpts);
  const systemLocal = interpolate(progress, [B2, B3], [0, 1], { ...clampOpts, easing: easeInOut });

  // ---- Shot 04 — solo PDP assembling --------------------------------------
  const soloOpacity = interpolate(progress, [B3 + 0.05, B3 + 0.14], [0, 1], clampOpts);
  const soloAssemble = interpolate(progress, [B3 + 0.05, B4 - 0.03], [0, 1], { ...clampOpts, easing: ease });

  // ---- Shot 04 -> 05 — hero card hands off into the 3-up row --------------
  const heroT = interpolate(progress, [B4, B4 + 0.1], [0, 1], { ...clampOpts, easing: easeInOut });
  const heroAccent = interpolateColors(heroT, [0, 1], [ACCENT as `#${string}`, "#FF5A46"]);
  const heroX = interpolate(heroT, [0, 1], [VIDEO_WIDTH * 0.5, VIDEO_WIDTH * 0.5 - 500]);
  const heroWidth = interpolate(heroT, [0, 1], [900, 460]);
  const heroHeight = interpolate(heroT, [0, 1], [560, 560]);

  const cardBEnter = interpolate(progress, [B4 + 0.04, B4 + 0.15], [0, 1], { ...clampOpts, easing: ease });
  const cardCEnter = interpolate(progress, [B4 + 0.07, B4 + 0.18], [0, 1], { ...clampOpts, easing: ease });

  const trioOpacity = interpolate(progress, [B4 - 0.01, B4 + 0.03, B5 + 0.03, 1], [1, 1, 1, 1], clampOpts);

  // ---- Shot 05 -> 06 — pullback + duplication field -----------------------
  const pullbackT = interpolate(progress, [B5 - 0.16, B5 + 0.02], [0, 1], { ...clampOpts, easing: easeInOut });
  const heroGroupScale = interpolate(pullbackT, [0, 1], [1, 0.42]);
  const heroGroupY = interpolate(pullbackT, [0, 1], [0, -60]);
  const duplicateFieldOpacity = interpolate(progress, [B5 - 0.1, B5 + 0.02], [0, 1], clampOpts);

  // ---- Final convergence — every card dissolves to the shared skeleton ----
  const skeletonAll = interpolate(progress, [B5 + 0.04, 1 - 0.015], [0, 1], { ...clampOpts, easing: Easing.in(Easing.cubic) });

  const duplicateCards = useMemo(
    () =>
      DUPLICATE_FIELD.map((card, i) => {
        const birth = interpolate(progress, [B5 - 0.1 + card.delay, B5 + 0.05 + card.delay], [0, 1], { ...clampOpts, easing: ease });
        const skStart = Math.min(B5 + 0.03 + card.delay * 0.3, 0.965);
        const sk = interpolate(progress, [skStart, 0.985], [0, 1], { ...clampOpts, easing: Easing.in(Easing.cubic) });
        return { ...card, key: i, birth, sk };
      }),
    [progress],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      <ConstructionGrid frame={frame} tiltDeg={tiltDeg} opacity={gridOpacity} blurPx={gridBlur}>
        {duplicateFieldOpacity > 0 &&
          duplicateCards.map((card) => (
            <div
              key={card.key}
              style={{
                position: "absolute",
                transform: `translate(${card.x - 100}px, ${card.y - 65}px) scale(${card.scale * card.birth}) rotate(${card.rotation}deg)`,
                opacity: duplicateFieldOpacity * card.birth,
              }}
            >
              <ProductDetailPage
                width={200}
                height={130}
                product={card.product}
                accent={card.accent}
                price="$—"
                assembleProgress={1}
                skeletonProgress={card.sk}
                cornerRadius={12}
              />
            </div>
          ))}
      </ConstructionGrid>

      {/* Shot 02 — the token */}
      {tokenOpacity > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ transform: `translateY(${VIDEO_HEIGHT * -0.04}px)`, opacity: tokenOpacity }}>
            <DesignToken size={tokenSize} glow={tokenGlow} selected={tokenSelected} />
          </div>
        </AbsoluteFill>
      )}

      {/* Shot 03 — rules before screens */}
      {systemOpacity > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: systemOpacity }}>
          <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
            <RulesPanel progress={systemLocal} width={460} />
            <StructureGrid progress={systemLocal} width={460} height={420} />
          </div>
        </AbsoluteFill>
      )}

      {/* Shot 04 — the solo PDP assembles, then hands off into Shot 05 */}
      {soloOpacity > 0 && (
        <AbsoluteFill style={{ opacity: soloOpacity }}>
          <div
            style={{
              position: "absolute",
              left: heroX,
              top: VIDEO_HEIGHT * 0.5 + heroGroupY,
              transform: `translate(-50%, -50%) scale(${heroGroupScale})`,
            }}
          >
            <ProductDetailPage
              width={heroWidth}
              height={heroHeight}
              product="shoe"
              accent={heroAccent}
              price="$129.00"
              assembleProgress={soloAssemble}
              skeletonProgress={skeletonAll}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Shot 05 — headphones + watch bud in beside the hero card */}
      {trioOpacity > 0 && (
        <AbsoluteFill>
          {cardBEnter > 0 && (
            <div
              style={{
                position: "absolute",
                left: VIDEO_WIDTH * 0.5,
                top: VIDEO_HEIGHT * 0.5 + heroGroupY,
                transform: `translate(-50%, -50%) scale(${heroGroupScale * interpolate(cardBEnter, [0, 1], [0.5, 1])})`,
                opacity: cardBEnter,
              }}
            >
              <ProductDetailPage width={460} height={560} product="headphones" accent="#7C5CFC" price="$199.00" assembleProgress={1} skeletonProgress={skeletonAll} />
            </div>
          )}
          {cardCEnter > 0 && (
            <div
              style={{
                position: "absolute",
                left: VIDEO_WIDTH * 0.5 + 500,
                top: VIDEO_HEIGHT * 0.5 + heroGroupY,
                transform: `translate(-50%, -50%) scale(${heroGroupScale * interpolate(cardCEnter, [0, 1], [0.5, 1])})`,
                opacity: cardCEnter,
              }}
            >
              <ProductDetailPage width={460} height={560} product="watch" accent="#2FBE83" price="$249.00" assembleProgress={1} skeletonProgress={skeletonAll} />
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
