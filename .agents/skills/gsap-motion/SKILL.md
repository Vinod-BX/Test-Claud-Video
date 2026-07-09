---
name: gsap-motion
description: Domain knowledge for using GSAP (GreenSock) timelines and eases inside Remotion compositions, where GSAP's staggered sequencing, custom eases, and SVG/text/motion-path plugins are needed beyond Remotion's own interpolate()/spring(). Use whenever writing or editing GSAP-driven animation in this Remotion project — building a gsap.timeline(), staggering many elements, morphing or drawing SVG paths, splitting text into chars/words, or picking an elastic/back/bounce/custom ease. Consult before wiring any GSAP timeline into a Remotion scene, since GSAP's default real-time ticker is NOT compatible with Remotion's frame-based rendering and must be driven manually.
metadata:
  tags: gsap, greensock, animation, motion, remotion, timeline, easing
---

## When to use

Use this skill whenever a scene needs GSAP specifically — usually because the choreography involves many elements staggered against each other, relative timeline positioning (labels, `"<"`, `"+=0.5"`), a GSAP-only ease (elastic, back, bounce, `CustomEase`, `CustomBounce`, `CustomWiggle`), or a GSAP plugin (`SplitText`, `DrawSVGPlugin`, `MorphSVGPlugin`, `MotionPathPlugin`).

For a single element animating a single property, prefer Remotion's own `interpolate()`/`spring()` (see the `remotion-best-practices` skill) — it's simpler and has no synchronization pitfalls. Reach for GSAP as the escape hatch for complex, multi-element choreography that would be unwieldy to express as a pile of individual `interpolate()` calls.

## Installation

GSAP ships as a single free package — as of the Webflow acquisition, every plugin (including former "Club GreenSock" plugins like `SplitText`, `MorphSVGPlugin`, `DrawSVGPlugin`) is bundled in the open `gsap` package, no separate registry or license key needed.

```bash
npm install gsap
```

## The core constraint: GSAP must be driven by the frame, not its own clock

Remotion renders by mounting the composition and reading `useCurrentFrame()` at an arbitrary, specific frame — frames can render out of order and in parallel worker processes with no continuity between them. GSAP's default behavior assumes the opposite: a `gsap.timeline()` created with `.play()` (the default) drives itself forward in real time off `gsap.ticker`'s `requestAnimationFrame` loop, independent of React renders.

If a GSAP timeline is left to autoplay, it will be at whatever position its internal clock happens to be at when a given frame is captured — not the position that corresponds to that frame. This produces glitchy, non-deterministic output (or a frozen first frame) once rendered to video.

The fix: always create the timeline `paused: true`, build the entire sequence of tweens up front, and manually `seek()`/`progress()` the timeline to the exact time implied by `useCurrentFrame()` on every render. Treat the GSAP timeline the same way Remotion treats `interpolate()`: a pure function of frame, evaluated fresh each time.

See [rules/timeline-sync.md](rules/timeline-sync.md) for the full pattern (building the timeline once with `useMemo`, seeking it in `useLayoutEffect`, and cleaning it up with `gsap.context()`).

## Easing and plugins reference

See [rules/easing-and-plugins.md](rules/easing-and-plugins.md) for the GSAP ease reference (`power1`-`power4`, `back`, `elastic`, `bounce`, `expo`, `circ`, `CustomEase`) and the free bonus plugins most useful in Remotion scenes (`SplitText`, `DrawSVGPlugin`, `MorphSVGPlugin`, `MotionPathPlugin`), including which ones do and don't apply inside Remotion (e.g. `ScrollTrigger`/`ScrollSmoother` don't apply — there is no scroll in a rendered video).

## Compatibility with this project's art-direction rules

CSS transitions and `@keyframes` animations are forbidden in Remotion because they run on the browser's own clock and don't render deterministically frame-by-frame. GSAP tweens are compatible with Remotion **only when driven via the seek pattern above** — GSAP writes computed values straight to inline styles/transform per tick, it doesn't hand timing off to the CSS engine, so a manually-seeked timeline renders exactly like `interpolate()` does.

This project also has a standing Art Direction brief (no bare fades, editorial scale, contextual background motion). Load [rules/art-direction.md](../remotion-best-practices/rules/art-direction.md) before designing or coding any scene — GSAP timelines must follow the same brief as any other Remotion animation.
