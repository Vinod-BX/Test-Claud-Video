import { COLORS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./tokens";

export type ScreenSlot = {
  id: string;
  /** center position, px */
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  accent: string;
};

// The tidy "resting state" of the 7 product-screen cards. Scene 1 opens here
// (silent hold) before scattering into chaos, and Scene 7 ends here (the
// Token re-emitting the grid in unison) — importing this ONE constant in
// both scenes is what makes the loop point (frame 4499 -> frame 0) match
// exactly. Never fork a per-scene copy of these numbers.
export const SCREEN_SLOTS: ScreenSlot[] = [
  { id: "product-page", x: VIDEO_WIDTH * 0.32, y: VIDEO_HEIGHT * 0.38, width: 300, height: 380, rotation: -4, accent: COLORS.deepViolet },
  { id: "checkout-flow", x: VIDEO_WIDTH * 0.62, y: VIDEO_HEIGHT * 0.34, width: 280, height: 360, rotation: 3, accent: COLORS.purpleRain },
  { id: "dashboard", x: VIDEO_WIDTH * 0.5, y: VIDEO_HEIGHT * 0.62, width: 340, height: 220, rotation: -2, accent: COLORS.indigo },
  { id: "settings", x: VIDEO_WIDTH * 0.22, y: VIDEO_HEIGHT * 0.68, width: 220, height: 280, rotation: 5, accent: COLORS.electricBlue },
  { id: "profile", x: VIDEO_WIDTH * 0.76, y: VIDEO_HEIGHT * 0.66, width: 240, height: 300, rotation: -6, accent: COLORS.deepViolet },
  { id: "search", x: VIDEO_WIDTH * 0.42, y: VIDEO_HEIGHT * 0.2, width: 260, height: 170, rotation: 2, accent: COLORS.purpleRain },
  { id: "notifications", x: VIDEO_WIDTH * 0.7, y: VIDEO_HEIGHT * 0.18, width: 200, height: 200, rotation: -3, accent: COLORS.indigo },
];
