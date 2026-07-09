import { FONT_FAMILY, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../design/tokens";

// Palette locked from the user-supplied storyboard shots (dot-field, token
// selection, token panel, product page, product family) — a multi-accent
// "design tokens" system on a white base canvas, distinct from the existing
// PortableDesignSystem brand palette.
export const CHIP = {
  blue: "#3B5BFF",
  indigo: "#6C4CF0",
  purple: "#A855F7",
  teal: "#2DD4BF",
  orange: "#FB923C",
  pink: "#EC4899",
  lime: "#A3E635",
  sky: "#38BDF8",
} as const;

export const CHIP_ORDER = [CHIP.blue, CHIP.purple, CHIP.teal, CHIP.orange, CHIP.pink, CHIP.sky, CHIP.indigo, CHIP.lime] as const;

export const INK = "#0B0F1A";
export const MUTED = "#8A8F9C";
export const HAIRLINE = "rgba(11, 15, 26, 0.08)";
export const CANVAS = "#FFFFFF";

export { FONT_FAMILY };

export const FILM_WIDTH = VIDEO_WIDTH;
export const FILM_HEIGHT = VIDEO_HEIGHT;
export const FILM_FPS = VIDEO_FPS;

export type ShotId =
  | "shot1DotField"
  | "shot2Selection"
  | "shot3TokenPanel"
  | "shot4ProductPage"
  | "shot5ProductFamily";

export type FilmShot = { id: ShotId; label: string; durationInSeconds: number };

// Sums to exactly 120s (2:00, per the locked brief) at 30fps = 3600 frames.
// No voiceover — paced to a 100bpm tempo grid (0.6s/beat, 4-beat bars ~2.4s)
// so a music track can be dropped in later without retiming cuts.
export const FILM_SHOTS: FilmShot[] = [
  { id: "shot1DotField", label: "Dot Field", durationInSeconds: 18 },
  { id: "shot2Selection", label: "Selection", durationInSeconds: 24 },
  { id: "shot3TokenPanel", label: "Token Panel", durationInSeconds: 30 },
  { id: "shot4ProductPage", label: "Product Page", durationInSeconds: 26 },
  { id: "shot5ProductFamily", label: "Product Family", durationInSeconds: 22 },
];

export const BEAT_SECONDS = 0.6;
export const beatsToFrames = (beats: number): number => Math.round(beats * BEAT_SECONDS * FILM_FPS);
