import "./index.css";
import { Composition, Folder } from "remotion";
import { calculateMetadata, PortableDesignSystem } from "./PortableDesignSystem";
import { SCRIPT_SCENES, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./design/tokens";
import { Scene1Opening } from "./scenes/Scene1Opening";
import { Scene2TheShift } from "./scenes/Scene2TheShift";
import { Scene3WhatThisEnables } from "./scenes/Scene3WhatThisEnables";
import { Scene4HowItWorks } from "./scenes/Scene4HowItWorks";
import { Scene5CrossPlatformGeneration } from "./scenes/Scene5CrossPlatformGeneration";
import { Scene6WhyThisMatters } from "./scenes/Scene6WhyThisMatters";
import { Scene7Closing } from "./scenes/Scene7Closing";
import { Shot1DotField } from "./tokenFilm/scenes/Shot1DotField";
import { Shot2Selection } from "./tokenFilm/scenes/Shot2Selection";
import { Shot3TokenPanel } from "./tokenFilm/scenes/Shot3TokenPanel";
import { Shot4ProductPage } from "./tokenFilm/scenes/Shot4ProductPage";
import { Shot5ProductFamily } from "./tokenFilm/scenes/Shot5ProductFamily";
import { TOKEN_FILM_PLAN, TokenSystemFilm } from "./tokenFilm/TokenSystemFilm";
import { FILM_FPS, FILM_HEIGHT, FILM_SHOTS, FILM_WIDTH } from "./tokenFilm/tokens";

const SCENE_COMPONENTS = [
  Scene1Opening,
  Scene2TheShift,
  Scene3WhatThisEnables,
  Scene4HowItWorks,
  Scene5CrossPlatformGeneration,
  Scene6WhyThisMatters,
  Scene7Closing,
];

const TOKEN_FILM_SHOT_COMPONENTS = [Shot1DotField, Shot2Selection, Shot3TokenPanel, Shot4ProductPage, Shot5ProductFamily];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PortableDesignSystem"
        component={PortableDesignSystem}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{}}
        calculateMetadata={calculateMetadata}
      />

      {/* Isolated per-scene compositions for scrubbing/QA in Studio — fixed
          script-timestamp durations, independent of the main composition's
          calculateMetadata. See rules/art-direction.md verification steps. */}
      <Folder name="Scenes">
        {SCRIPT_SCENES.map((scene, index) => {
          const SceneComponent = SCENE_COMPONENTS[index];
          const durationInFrames = Math.round(scene.baseDurationInSeconds * VIDEO_FPS);
          return (
            <Composition
              key={scene.id}
              id={scene.label.replace(/\s+/g, "")}
              component={SceneComponent}
              fps={VIDEO_FPS}
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              durationInFrames={durationInFrames}
              defaultProps={{ durationInFrames }}
            />
          );
        })}
      </Folder>

      <Composition
        id="TokenSystemFilm"
        component={TokenSystemFilm}
        fps={FILM_FPS}
        width={FILM_WIDTH}
        height={FILM_HEIGHT}
        durationInFrames={TOKEN_FILM_PLAN.totalDurationInFrames}
        defaultProps={{}}
      />

      <Folder name="TokenSystemFilmShots">
        {FILM_SHOTS.map((shot, index) => {
          const ShotComponent = TOKEN_FILM_SHOT_COMPONENTS[index];
          const durationInFrames = Math.round(shot.durationInSeconds * FILM_FPS);
          return (
            <Composition
              key={shot.id}
              id={shot.label.replace(/\s+/g, "")}
              component={ShotComponent}
              fps={FILM_FPS}
              width={FILM_WIDTH}
              height={FILM_HEIGHT}
              durationInFrames={durationInFrames}
              defaultProps={{ durationInFrames }}
            />
          );
        })}
      </Folder>
    </>
  );
};
