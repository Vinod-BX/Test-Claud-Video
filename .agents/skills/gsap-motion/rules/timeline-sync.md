# Syncing a GSAP timeline to Remotion's frame

## Pattern

1. Build the timeline once, paused, with `gsap.context()` scoped to a container ref so selector-based tweens (`gsap.context` + `contextSafe`, or plain refs) and cleanup are scoped to this component instance.
2. Never call `.play()`, `.resume()`, or rely on `gsap.ticker` — the timeline's playhead is only ever moved by an explicit `seek()`/`progress()` call.
3. On every render, compute the timeline's time from `useCurrentFrame()` / `fps` and seek to it inside `useLayoutEffect` (not `useEffect`) so the DOM is updated before Remotion captures the frame.
4. Revert the context on unmount so tweens don't leak between scenes/compositions during Studio hot-reload or multi-composition renders.

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";

export const StaggeredReveal: React.FC<{ labels: string[] }> = ({ labels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const container = useRef<HTMLDivElement>(null);

  const { timeline, ctx } = useMemo(() => {
    let tl!: gsap.core.Timeline;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({ paused: true });
      tl.from(".reveal-item", {
        y: 60,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
      });
    }, container);
    return { timeline: tl, ctx };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    timeline.seek(frame / fps);
  }, [frame, fps, timeline]);

  useLayoutEffect(() => {
    return () => ctx.revert();
  }, [ctx]);

  return (
    <div ref={container}>
      {labels.map((label) => (
        <div key={label} className="reveal-item">
          {label}
        </div>
      ))}
    </div>
  );
};
```

## Why `useLayoutEffect`, not `useEffect`

`useLayoutEffect` runs synchronously after DOM mutations and before the browser paints. Remotion's headless renderer captures the frame after paint, so the seek must land before that — `useEffect` runs asynchronously and can miss the paint Remotion captures, producing a one-frame-stale (or blank) result on the very first frame of a sequence.

## Total duration must match the Sequence, not the other way around

Size the timeline's tweens so the GSAP timeline's total duration matches (or is shorter than) the enclosing `<Sequence>`'s `durationInFrames / fps`. If the GSAP timeline is longer, `seek()` past its end simply holds the final state — which is usually fine — but don't rely on that to silently truncate a longer animation; trim the tweens deliberately instead.

## Don't rebuild the timeline every frame

Building a `gsap.timeline()` allocates tweens and does layout work — building it fresh on every one of hundreds of frames is wasteful and can introduce jitter from floating point drift across rebuilds. Build once in `useMemo` (or a ref set up in an effect that runs only on mount), and only ever call `seek()`/`progress()` in response to frame changes.

## Randomness and non-determinism

Avoid GSAP features that introduce non-determinism across renders — e.g. `stagger: { from: "random" }` re-randomizes on every timeline construction. Since the timeline is built once per mount in this pattern that's usually safe within a single render, but if Remotion re-mounts the component per-frame during a parallelized render (rare, but possible for `<Still>` or per-frame stills), a random stagger origin can produce a different look per frame. Prefer deterministic stagger origins (`"start"`, `"end"`, `"center"`, an index, or a fixed array) for anything that must render identically across a distributed render.
