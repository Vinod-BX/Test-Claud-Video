# Framer Motion features that don't translate to Remotion

Framer Motion's most convenient declarative features are built around a real, continuously-running app with live user interaction and a persistent component tree across renders. Remotion mounts a composition and reads `useCurrentFrame()` at one specific, possibly out-of-order, possibly-parallelized point in time — there's no guarantee of "the previous frame" existing in the same process. These features rely on exactly that guarantee, so avoid them in Remotion scenes:

## `AnimatePresence`

`AnimatePresence` plays an `exit` animation when a child is removed from the React tree, keeping it mounted until the exit animation's `onExitComplete` fires — a callback driven by real elapsed time. There's no way to tell Remotion "this frame is 12 frames into an exit animation that started because the child unmounted"; the unmount event itself doesn't have a frame-deterministic meaning.

**Instead:** drive presence explicitly from the frame. Keep the element mounted for its entire visible range (entry + exit) inside a single `<Sequence>` sized to cover both, and compute the exit animation's progress the same way as the entry — via the scrubbing pattern in [scrubbing.md](scrubbing.md), based on how many frames remain before the `<Sequence>` ends. Don't unmount the element to trigger the animation; render its exit state as a function of frame directly.

## `layout` / `layoutId` (shared-element and auto-layout animations)

`layout` and `layoutId` animations work by measuring an element's DOM position/size (FLIP) before and after a React commit, then animating between the two — inherently a two-commit, two-point-in-time comparison tied to whatever happened to trigger a re-render in a live app. In Remotion, each captured frame doesn't carry forward "the previous commit's measured box" in a way that reconstructs the same interpolation on an arbitrary frame, especially across a parallelized render where frames render in separate processes.

**Instead:** if two states need to visually morph into each other (e.g. a card moving from a list position to a detail position), measure or hard-code both states' geometry yourself, and interpolate between them explicitly as a function of frame — the same way any other Remotion transition is authored (see the `remotion-best-practices` skill's `rules/transitions.md`). A GSAP `MorphSVGPlugin` tween (see the `gsap-motion` skill) is a better fit than `layoutId` for shape morphs specifically.

## Gesture handlers (`whileHover`, `whileTap`, `onPan`, drag)

These respond to real pointer/touch input, which doesn't exist during a render. They're inert in Remotion (no error, they simply never fire) — don't rely on them for any part of the visible animation; if a design needs to depict a "hover" or "press" state, drive it as an explicit scene beat via the frame instead.

## What's safe to use as-is

Static styling via the `motion.*` components (they're otherwise ordinary elements), `useMotionValue`/`useTransform` when their inputs are derived purely from `useCurrentFrame()` (no gesture/scroll input feeding them), and any imperative `animate()` call scrubbed per [scrubbing.md](scrubbing.md).
