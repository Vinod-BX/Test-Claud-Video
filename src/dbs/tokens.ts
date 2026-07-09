// "Design Beyond Screens" — a separate, unbranded film living alongside the
// Bounteous PortableDesignSystem video. White/grey canvas, one restrained
// accent. No client brand applies here (see project brief in the task).
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../design/tokens";

export { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH };

export const GREY = {
  50: "#F8F9FB",
  100: "#EEF0F4",
  150: "#E6E9EE",
  200: "#DCE0E7",
  300: "#C6CBD4",
  400: "#9CA3B1",
  500: "#767E8E",
  600: "#565E6D",
  700: "#3A4049",
  800: "#232730",
  ink: "#14161A",
} as const;

// The one restrained accent — used only to guide attention (token glow,
// selection UI, the system's own primary-action colour).
export const ACCENT = "#2F63FF";
export const ACCENT_SOFT = "#E3EAFF";

// The narrative point of Shot 05 is that every rebuild reinvents its own
// palette — these are diegetic "brand" colours for the example pages being
// criticised, deliberately varied, never used for the film's own chrome.
export const REBUILD_ACCENTS = {
  shoe: "#FF5A46",
  headphones: "#7C5CFC",
  watch: "#2FBE83",
} as const;

export const WHITE = "#FFFFFF";

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const SPACING = {
  xs: 8,
  sm: 16,
  md: 28,
  lg: 48,
  xl: 80,
} as const;

export const FONT_FAMILY = "Inter";

export const TYPE_SCALE = {
  display: 128,
  h1: 96,
  h2: 64,
  h3: 40,
  body: 30,
  label: 22,
  micro: 17,
} as const;
