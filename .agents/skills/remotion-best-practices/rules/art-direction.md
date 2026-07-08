---
name: art-direction
description: Standing Art Direction / Creative Direction style brief for this project's Remotion videos — canvas, motion, scale, and quality bar.
metadata:
  tags: art-direction, style, brand, motion-design, transitions
---

## Canvas & background

White base canvas by default. If a supplied brand system's native identity is dark/gradient-driven, confirm with the user whether it should override the white-base default before building — don't silently pick one.

Never add a decorative background layer with no relationship to the content. Prefer making the content itself double as the background motion (e.g. the data visualization drifting, a diagram assembling, a recurring motif recomposing) over a separate ambient loop.

## No default transitions

Never import `fade()`, `slide()`, `wipe()`, or other built-in presentations from `@remotion/transitions`. Always author a custom `TransitionPresentation<Props>` (see [rules/transitions.md](transitions.md)) whose motion is specific to what's being cut between — e.g. a wipe shaped like the object being introduced, not a generic diagonal.

## No stock-video clichés

Avoid generic swooshes, lens flares, confetti/particle bursts, and sparkle/starburst effects (`starburst()` from [rules/effects.md](effects.md), `@remotion/starburst`, `@remotion/animated-emoji`) unless the brand system explicitly calls for them. These read as template filler, not intentional direction.

## Editorial type scale

On a 1920×1080 canvas, headline/display text should read comfortably from across a room — treat anything under ~72px as a supporting/label size, not a headline. Reveal one focal statement at a time; don't stack multiple competing headlines in the same frame (see [rules/video-layout.md](video-layout.md) for crowding guidance).

## Physics vs. deliberate motion

Per [rules/timing.md](timing.md), default to `interpolate()` with `Easing.bezier()`. Reserve `spring()` for moments that are genuinely a physical snap/settle (a piece locking into place, an object landing) — using it everywhere makes every beat feel the same weight.

## Quality bar

Every scene should look intentional: a clear focal point, no overlapping/crowded elements, motion tied to the voiceover/script beat it accompanies rather than running on a generic timer. If a beat doesn't have a specific reason for its motion, cut it rather than filling time.
