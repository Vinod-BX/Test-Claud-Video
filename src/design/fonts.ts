import { loadFont } from "@remotion/fonts";
import { useEffect } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { FONT_FAMILY } from "./tokens";

let fontsLoadedPromise: Promise<void> | null = null;

// Local Nunito Sans files (client-provided), loaded via @remotion/fonts per
// rules/local-fonts.md. Loaded once and memoized so every scene sharing this
// hook waits on the same promise instead of re-requesting the files.
const loadNunitoSans = (): Promise<void> => {
  if (!fontsLoadedPromise) {
    fontsLoadedPromise = Promise.all([
      loadFont({
        family: FONT_FAMILY,
        url: staticFile("fonts/nunito-sans/NunitoSans-Light.ttf"),
        weight: "300",
      }),
      loadFont({
        family: FONT_FAMILY,
        url: staticFile("fonts/nunito-sans/NunitoSans-Regular.ttf"),
        weight: "400",
      }),
      loadFont({
        family: FONT_FAMILY,
        url: staticFile("fonts/nunito-sans/NunitoSans-Bold.ttf"),
        weight: "700",
      }),
      loadFont({
        family: FONT_FAMILY,
        url: staticFile("fonts/nunito-sans/NunitoSans-ExtraBold.ttf"),
        weight: "800",
      }),
    ]).then(() => undefined);
  }

  return fontsLoadedPromise;
};

// Call once at the top of the root composition so rendering (Studio + CLI
// render/still) waits for every weight to be ready before the first frame.
export const useNunitoSansLoaded = (): void => {
  useEffect(() => {
    const handle = delayRender("Loading Nunito Sans font files");
    loadNunitoSans()
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error("Failed to load Nunito Sans", err);
        continueRender(handle);
      });
  }, []);
};
