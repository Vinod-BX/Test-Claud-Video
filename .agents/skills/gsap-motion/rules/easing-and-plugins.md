# GSAP easing and plugin reference (for Remotion scenes)

## Eases

GSAP eases are strings passed to `ease:` on a tween, e.g. `ease: "power3.out"`. Format is `family.mode` (`mode` is `in`, `out`, or `inOut`; omit mode for `in`).

- `power1` / `power2` / `power3` / `power4` — increasingly strong acceleration/deceleration curves. `power3.out`/`power4.out` are good defaults for confident editorial reveals.
- `back` — slight overshoot past the target before settling. `back.out(1.7)` — the argument controls overshoot strength.
- `elastic` — spring-like oscillation. `elastic.out(1, 0.3)` — amplitude, period.
- `bounce` — bounces at the end like a dropped ball.
- `expo` / `circ` / `sine` — exponential, circular, and sinusoidal curves.
- `CustomEase`, `CustomBounce`, `CustomWiggle` — author bespoke eases from an SVG path or parameters when the stock curves don't match the brand's motion language. Register with `CustomEase.create("myEase", "M0,0 C...")`.

Match the ease to intent, per this project's Motion Philosophy brief: `power3`/`power4` for confident, editorial moves; `back`/`elastic` only when a touch of personality is wanted and the brand system calls for it — not as a default on every element.

## Free bonus plugins relevant in Remotion

All GSAP plugins are free (no Club GreenSock membership required). Import only what's used:

```tsx
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import gsap from "gsap";

gsap.registerPlugin(SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin);
```

- **`SplitText`** — splits text into chars/words/lines for per-character stagger reveals. Split once (on mount, before building the timeline), tween the resulting elements, and revert the split in cleanup (`splitInstance.revert()`) alongside `gsap.context().revert()`.
- **`DrawSVGPlugin`** — animates an SVG stroke being "drawn" by tweening `drawSVG` (e.g. `from: "0%"`, `to: "100%"`). Good for diagrams, signatures, line-art logos.
- **`MorphSVGPlugin`** — morphs one SVG path's shape into another (`morphSVG: "#targetPath"`). Requires the two paths to be reasonably compatible in point count/order for a clean morph — simple icon-to-icon morphs work best.
- **`MotionPathPlugin`** — moves an element along an SVG path (`motionPath: { path: "#myPath", autoRotate: true }`). Useful for a data point or icon traveling along a diagram/route.

## Plugins that do NOT apply in Remotion

- **`ScrollTrigger`, `ScrollSmoother`, `Observer` (scroll/drag mode)** — these bind to real user scroll/pointer input, which doesn't exist in a rendered video. Don't reach for them; express the equivalent progress directly as a function of `useCurrentFrame()` instead.
- **`Flip`** — built around measuring live DOM layout across a *real* transition triggered by user interaction; not meaningful in a frame-seeked render. Prefer explicit `interpolate()`/GSAP tweens between the two known states instead.
