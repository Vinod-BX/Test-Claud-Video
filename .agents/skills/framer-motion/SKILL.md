---
name: framer-motion
description: Domain knowledge for using Framer Motion (npm package framer-motion, upstream renamed "Motion") inside Remotion compositions — gesture-flavored springs, the imperative animate()/useAnimate() scrubbing API, and where its declarative features (AnimatePresence, layout/layoutId) don't translate to Remotion's frame-based render model. Use whenever writing or editing Framer Motion-driven animation in this Remotion project. Consult before wiring any motion.* component or animate() call into a Remotion scene, since Framer Motion's declarative animate prop and AnimatePresence rely on real component lifecycle/interaction that isn't compatible with deterministic per-frame rendering without the seek pattern below.
metadata:
  tags: framer-motion, motion, animation, motion, remotion, spring, gestures
---

## When to use

Use this skill whenever a scene needs Framer Motion specifically — usually because the choreography wants its spring-physics feel, or the project already has Framer Motion components authored elsewhere (e.g. ported from a marketing site) that need to run inside Remotion.

For a single element animating a single property, prefer Remotion's own `interpolate()`/`spring()` (see the `remotion-best-practices` skill) — no library, no synchronization pitfalls. For complex multi-element timeline choreography (staggers, labels, relative positioning, SVG morph/draw), prefer the `gsap-motion` skill — GSAP's timeline model fits Remotion's frame-seeking pattern more directly than Framer Motion's component-lifecycle model. Reach for Framer Motion specifically when its spring feel or an existing `motion.*` component tree is what's being ported in.

## Installation

```bash
npm install framer-motion
```

`framer-motion` is the React-focused entry point maintained by the same team/repo as the rebranded "Motion" library (`motion` package) — same engine, React-specific API surface (`motion.div`, `AnimatePresence`, `useAnimate`, `useSpring`, etc).

## The core constraint: Framer Motion must be driven by the frame, not its own clock or lifecycle

Framer Motion's usual mode — `<motion.div animate={{ opacity: 1 }} />` — starts an animation the moment the prop changes and drives it forward in real time via its own scheduler (falling back to the Web Animations API or `requestAnimationFrame`), independent of React renders. That's the opposite of Remotion's model, where a frame is captured by reading state at an arbitrary, specific `useCurrentFrame()` value — frames can render out of order and in parallel worker processes with no continuity between them.

Left on autoplay, a `motion.div`'s animation will be at whatever position its internal clock happens to be at when a given frame is captured — not the position implied by that frame. This produces glitchy, non-deterministic output once rendered to video (or a frozen first frame, since the animation has often barely started by the time a still is captured).

The fix mirrors the GSAP pattern: build the animation imperatively and paused, then manually scrub it to the exact time implied by `useCurrentFrame()` on every render. See [rules/scrubbing.md](rules/scrubbing.md) for the full pattern using `useAnimate()`'s imperative `animate()`, whose returned controls expose a settable `.time`.

## Declarative features that don't translate to Remotion

`AnimatePresence` (mount/unmount exit animations) and `layout`/`layoutId` (FLIP shared-element/auto-layout animations) are built around real component lifecycle and a live DOM measured across two consecutive commits — neither holds up under Remotion's per-frame, possibly-parallelized rendering. See [rules/declarative-pitfalls.md](rules/declarative-pitfalls.md) for what to use instead (Remotion `<Sequence>` mount/unmount timing, and manually interpolated geometry for "morph between two layouts").

## Compatibility with this project's art-direction rules

CSS transitions and `@keyframes` are forbidden in Remotion because they run on the browser's own clock and don't render deterministically frame-by-frame. Framer Motion is compatible **only when driven via the scrubbing pattern above** — an unscrubbed `motion.div animate={...}` is exactly the kind of ungoverned, real-time animation the art-direction brief's CSS-animation ban is meant to prevent, just with a JS-driven engine instead of the CSS engine.

This project also has a standing Art Direction brief (no bare fades, editorial scale, contextual background motion). Load [rules/art-direction.md](../remotion-best-practices/rules/art-direction.md) before designing or coding any scene — Framer Motion animations must follow the same brief as any other Remotion animation.
