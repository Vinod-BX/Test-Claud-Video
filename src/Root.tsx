import "./index.css";
import { Composition, Folder } from "remotion";
import { DesignBeyondScreens } from "./dbs/DesignBeyondScreens";
import { Scene01DesignGetsRebuilt } from "./dbs/scenes/Scene01DesignGetsRebuilt";
import { calculateMetadata, PortableDesignSystem } from "./PortableDesignSystem";
import { SCRIPT_SCENES, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./design/tokens";
import { Scene1Opening } from "./scenes/Scene1Opening";
import { Scene2TheShift } from "./scenes/Scene2TheShift";
import { Scene3WhatThisEnables } from "./scenes/Scene3WhatThisEnables";
import { Scene4HowItWorks } from "./scenes/Scene4HowItWorks";
import { Scene5CrossPlatformGeneration } from "./scenes/Scene5CrossPlatformGeneration";
import { Scene6WhyThisMatters } from "./scenes/Scene6WhyThisMatters";
import { Scene7Closing } from "./scenes/Scene7Closing";

const SCENE_COMPONENTS = [
  Scene1Opening,
  Scene2TheShift,
  Scene3WhatThisEnables,
  Scene4HowItWorks,
  Scene5CrossPlatformGeneration,
  Scene6WhyThisMatters,
  Scene7Closing,
];

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

      {/* "Design Beyond Screens" — a separate, unbranded film. Scene 01 is
          the only scene built so far; fixed to its 0:00-0:15 script duration
          until later scenes exist to drive a shared calculateMetadata. */}
      <Composition
        id="DesignBeyondScreens"
        component={DesignBeyondScreens}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        durationInFrames={15 * VIDEO_FPS}
        defaultProps={{ durationInFrames: 15 * VIDEO_FPS }}
      />
      <Folder name="DesignBeyondScreens">
        <Composition
          id="DBS-Scene01-DesignGetsRebuilt"
          component={Scene01DesignGetsRebuilt}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          durationInFrames={15 * VIDEO_FPS}
          defaultProps={{ durationInFrames: 15 * VIDEO_FPS }}
        />
      </Folder>
    </>
  );
};
