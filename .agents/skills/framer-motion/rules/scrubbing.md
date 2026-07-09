# Scrubbing Framer Motion animations to Remotion's frame

## Pattern

Use the imperative `animate()` function (from `"framer-motion"`) with `autoplay: false`, keep the returned `AnimationPlaybackControls` in a ref, and set `.time` (seconds) inside `useLayoutEffect` on every frame. This is the same shape as the GSAP seek pattern in the `gsap-motion` skill — build once, scrub deterministically.

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useLayoutEffect, useRef } from "react";
import { animate, stagger, type AnimationPlaybackControls } from "framer-motion";

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
```

Notes:

- `autoplay: false` creates the animation already paused at its start state — it never runs on its own clock.
- `stagger(interval)` returns a `(index, total) => delay` function; calling it directly (`stagger(0.12)(i, elements.length)`) gives a plain per-index delay number to pass into `animate()`, which composes cleanly with the manual scrub loop. `stagger()` also accepts `{ from: "center" | "last" | number, ease }` for the origin of the stagger.
- `.time` is in **seconds**, matching `frame / fps` — not frame count.
- Give every animation an explicit `duration` (or a `type: "spring"` with an explicit `visualDuration`/`bounce`) so its total length is knowable; an open-ended, un-bounded spring makes it unclear what `.time` value corresponds to "settled".
- Clean up in the effect's return (`c.stop()`) so animations don't leak across remounts (Studio hot reload, or moving between compositions).

## `useAnimate()` for scoped selector-based animation

For animating multiple descendants by CSS selector (instead of holding a ref per element), use the `useAnimate()` hook — it returns `[scope, animate]` where `animate` is pre-scoped to elements inside `scope`:

```tsx
import { useAnimate } from "framer-motion";

const [scope, animate] = useAnimate();
// <div ref={scope}>...</div>
// animate(".reveal-item", { opacity: [0, 1] }, { autoplay: false, ... })
```

The returned `animate` still takes the same options (`autoplay: false`, then scrub the returned controls' `.time`) — `useAnimate()` only changes how the target element(s) are resolved, not the scrubbing mechanics.

## Springs need a bounded duration

`type: "spring"` animations can run indefinitely if under-damped without an explicit stopping point. Pass `visualDuration` (perceived settle time in seconds) alongside `bounce` to keep the spring's effective duration knowable, the same way Remotion's own `spring()` takes `durationInFrames`/config to bound its output. An unbounded spring makes `.time` scrubbing produce an animation that's still visibly settling at frames far past where the design expects it to be done.
