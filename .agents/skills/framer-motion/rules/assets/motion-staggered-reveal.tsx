import { useCurrentFrame, useVideoConfig } from "remotion";
import { useLayoutEffect, useRef } from "react";
import { animate, stagger, type AnimationPlaybackControls } from "framer-motion";

/**
 * Reference example: a row of labels staggering in with Framer Motion's
 * imperative animate(), driven deterministically by Remotion's frame
 * instead of the animation's own clock. See ../scrubbing.md for the pattern.
 */
export const MotionStaggeredReveal: React.FC<{ labels: string[] }> = ({
  labels,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const controls = useRef<AnimationPlaybackControls[]>([]);

  useLayoutEffect(() => {
    const elements = itemRefs.current.filter(
      (el): el is HTMLDivElement => el !== null,
    );
    controls.current = elements.map((el, i) =>
      animate(
        el,
        { opacity: [0, 1], y: [60, 0] },
        {
          duration: 0.6,
          delay: stagger(0.12)(i, elements.length),
          ease: [0.16, 1, 0.3, 1],
          autoplay: false,
        },
      ),
    );
    return () => {
      controls.current.forEach((c) => c.stop());
    };
  }, []);

  useLayoutEffect(() => {
    controls.current.forEach((c) => {
      c.time = frame / fps;
    });
  }, [frame, fps]);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {labels.map((label, i) => (
        <div
          key={label}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          style={{ fontSize: 48, fontWeight: 700 }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};
