import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { staticFile } from "remotion";
import { SCRIPT_SCENES, SceneId } from "../design/tokens";

const VOICEOVER_DIR = "voiceover/portable-design-system";

const scriptFallbackSeconds = (sceneId: SceneId): number => {
  const scene = SCRIPT_SCENES.find((s) => s.id === sceneId);
  if (!scene) {
    throw new Error(`Unknown scene id: ${sceneId}`);
  }
  return scene.baseDurationInSeconds;
};

/**
 * Real per-scene voiceover duration once the client delivers audio, per
 * rules/get-audio-duration.md (Mediabunny). Recommended file layout is one
 * MP3 per scene — public/voiceover/portable-design-system/<sceneId>.mp3 —
 * so re-recording a single scene re-trues only that scene's timing.
 *
 * Falls back to the script's own timestamps (SCRIPT_SCENES) when the file
 * doesn't exist yet, which is the case for every scene today.
 */
export const getSceneDurationInSeconds = async (sceneId: SceneId): Promise<number> => {
  try {
    const input = new Input({
      formats: ALL_FORMATS,
      source: new UrlSource(staticFile(`${VOICEOVER_DIR}/${sceneId}.mp3`), {
        getRetryDelay: () => null,
      }),
    });
    return await input.computeDuration();
  } catch {
    return scriptFallbackSeconds(sceneId);
  }
};

export const getAllSceneDurationsInSeconds = async (): Promise<Record<SceneId, number>> => {
  const entries = await Promise.all(
    SCRIPT_SCENES.map(async (scene) => [scene.id, await getSceneDurationInSeconds(scene.id)] as const),
  );
  return Object.fromEntries(entries) as Record<SceneId, number>;
};
