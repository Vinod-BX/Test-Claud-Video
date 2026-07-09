import { loadFont } from "@remotion/google-fonts/Inter";

// Loaded once at module scope — @remotion/google-fonts blocks rendering
// until ready, so no manual delayRender/continueRender dance is needed
// (unlike the local Nunito Sans files in src/design/fonts.ts).
export const { fontFamily: INTER_FONT_FAMILY } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
