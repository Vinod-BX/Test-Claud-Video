import "./index.css";
import { Composition, Folder } from "remotion";
import { calculateMetadata, PortableDesignSystem } from "./PortableDesignSystem";
import { SCRIPT_SCENES, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./design/tokens";
import { InfiniteDesignSpace, INFINITE_DESIGN_SPACE_DURATION } from "./scenes/infiniteSpace/InfiniteDesignSpace";
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

      <Composition
        id="InfiniteDesignSpace"
        component={InfiniteDesignSpace}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        durationInFrames={INFINITE_DESIGN_SPACE_DURATION}
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
    </>
  );
};
