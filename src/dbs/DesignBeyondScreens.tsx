import React from "react";
import { AbsoluteFill } from "remotion";
import "./fonts";
import { Scene01DesignGetsRebuilt } from "./scenes/Scene01DesignGetsRebuilt";

export type DesignBeyondScreensProps = {
  durationInFrames: number;
};

/**
 * "Portable Design Systems — Design Beyond Screens" — a separate, unbranded
 * film living alongside the Bounteous PortableDesignSystem video. Only
 * Scene 01 exists so far; future scenes join this composition the same way
 * PortableDesignSystem.tsx chains its own via TransitionSeries.
 */
export const DesignBeyondScreens: React.FC<DesignBeyondScreensProps> = ({ durationInFrames }) => {
  return (
    <AbsoluteFill>
      <Scene01DesignGetsRebuilt durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};
