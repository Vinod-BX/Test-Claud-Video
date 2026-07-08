// Bounteous brand tokens (Brand Guidelines 2.1 — Primary Colors) and the
// shared type/spacing/scene-timing scales every scene draws from.

export const COLORS = {
  midnight: "#0B111C",
  indigo: "#33139F",
  deepViolet: "#693AF4",
  purpleRain: "#853EFF",
  electricBlue: "#34B4FF",
  white: "#FFFFFF",
  ink: "#0B111C",
} as const;

export const BRAND_GRADIENT_STOPS = [
  COLORS.midnight,
  COLORS.indigo,
  COLORS.deepViolet,
  COLORS.purpleRain,
  COLORS.electricBlue,
] as const;

export const GRADIENT_BRAND = `linear-gradient(135deg, ${BRAND_GRADIENT_STOPS.join(", ")})`;

// Accent used for a single-clause emphasis, cycling through the mid-palette
// (skipping the near-black/near-white extremes so it always reads on white).
export const ACCENTS = [
  COLORS.indigo,
  COLORS.deepViolet,
  COLORS.purpleRain,
  COLORS.electricBlue,
] as const;

export const SPACING = {
  xs: 8,
  sm: 16,
  md: 32,
  lg: 64,
  xl: 96,
  xxl: 144,
} as const;

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 28,
  pill: 999,
} as const;

// Editorial scale for a 1920x1080 canvas — headline sizes stay well above the
// "readable across a room" floor called for in the art-direction brief.
export const TYPE_SCALE = {
  display: 140,
  h1: 104,
  h2: 72,
  h3: 48,
  body: 34,
  label: 26,
} as const;

export const FONT_FAMILY = "Nunito Sans";

export type SceneId =
  | "scene1Opening"
  | "scene2TheShift"
  | "scene3WhatThisEnables"
  | "scene4HowItWorks"
  | "scene5CrossPlatformGeneration"
  | "scene6WhyThisMatters"
  | "scene7Closing";

export type ScriptScene = {
  id: SceneId;
  label: string;
  baseDurationInSeconds: number;
};

// Fallback timing straight from the client's timestamped script. Sums to
// exactly 150s. Superseded scene-by-scene once real voiceover files exist —
// see src/audio/scene-audio.ts.
export const SCRIPT_SCENES: ScriptScene[] = [
  { id: "scene1Opening", label: "Opening", baseDurationInSeconds: 15 },
  { id: "scene2TheShift", label: "The Shift", baseDurationInSeconds: 20 },
  { id: "scene3WhatThisEnables", label: "What This Enables", baseDurationInSeconds: 20 },
  { id: "scene4HowItWorks", label: "How It Works", baseDurationInSeconds: 35 },
  { id: "scene5CrossPlatformGeneration", label: "Cross-Platform Generation", baseDurationInSeconds: 20 },
  { id: "scene6WhyThisMatters", label: "Why This Matters", baseDurationInSeconds: 25 },
  { id: "scene7Closing", label: "Closing", baseDurationInSeconds: 15 },
];

export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;
