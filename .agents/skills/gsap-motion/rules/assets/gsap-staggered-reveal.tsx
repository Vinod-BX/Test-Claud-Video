import { useCurrentFrame, useVideoConfig } from "remotion";
import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";

/**
 * Reference example: a row of labels staggering in with GSAP, driven
 * deterministically by Remotion's frame instead of GSAP's own ticker.
 * See ../timeline-sync.md for the pattern this follows.
 */
export const GsapStaggeredReveal: React.FC<{ labels: string[] }> = ({
  labels,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const container = useRef<HTMLDivElement>(null);

  const { timeline, ctx } = useMemo(() => {
    let tl!: gsap.core.Timeline;
    const context = gsap.context(() => {
      tl = gsap.timeline({ paused: true });
      tl.from(".gsap-reveal-item", {
        y: 60,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
      });
    }, container);
    return { timeline: tl, ctx: context };
  }, []);

  useLayoutEffect(() => {
    timeline.seek(frame / fps);
  }, [frame, fps, timeline]);

  useLayoutEffect(() => {
    return () => ctx.revert();
  }, [ctx]);

  return (
    <div
      ref={container}
      style={{ display: "flex", gap: 24, fontSize: 48, fontWeight: 700 }}
    >
      {labels.map((label) => (
        <div key={label} className="gsap-reveal-item">
          {label}
        </div>
      ))}
    </div>
  );
};
