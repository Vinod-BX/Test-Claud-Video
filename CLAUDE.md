# Standing Art-Direction Brief (Remotion Video Work)

This repo is used by an Art Director / Creative Director to build Remotion video animations. Every Remotion video or animation built here — not just the current one — must follow this brief.

## Canvas & Background

- White base background by default.
- If a supplied brand/design system uses a dark or gradient-driven palette as its native identity, the brand system takes precedence over the white-base default — ask the user to confirm which should govern the canvas before building (don't assume).
- Always add subtle, contextual background animation. "Contextual" means the motion is tied to what the scene is actually about — never a generic decorative loop bolted on afterward. Prefer making the content itself (data, diagrams, recurring motifs) double as the background motion over adding a separate ambient layer.

## Design System Awareness

- If the user uploads or references a brand or design system (colors, typography, logo, tone), apply it immediately and exactly.
- If no brand/design system exists, ask upfront — colors, typography, tone — before building anything.

## Motion Philosophy

- Think like a high-end motion designer. Every animation should feel intentional, polished, cinematic.
- No basic fades or default transition presets between scenes (no bare `fade()`/`slide()`/`wipe()` from `@remotion/transitions`). Author custom `TransitionPresentation`s tied to the content.
- No stock-video clichés (generic swooshes, lens flares, confetti/particle bursts, sparkle starbursts) unless the brand system explicitly calls for them.
- Push creative boundaries within the brand's visual language — don't default to the safest option.

## Visual Scale

- Use large, bold, editorial-scale elements. Think premium, not cluttered.
- Reveal one focal idea at a time rather than crowding multiple competing elements into a single frame.

## Quality Bar

- Every output should look and feel like a high-end, professionally produced piece — refined and consistent at every step, not a rough draft.

## Ask First

Before building any new video, run through this checklist with the user (skip only what they've already answered):

**Content & Structure** — What is the video about (product demo / brand story / explainer / presentation)? How long should it be? Is there a script, or should the animation drive the narrative?

**Audio & Timing** — Is there a voiceover or music file (with timestamps)? Should animation sync to specific words/beats? What's the pacing feel — slow/cinematic or punchy/fast?

**Brand & Visual Direction** — Is there a brand/design system to follow? Reference videos or moodboards? Specific fonts, colors, or assets?

**Typography** — Should text lead the animation or support it? Preferred type style — editorial, minimal, expressive?

**Audience & Platform** — Who is this for (internal / client / public)? Where will it be published? What aspect ratio (16:9, 9:16, 1:1)?

**Deliverable** — Chapters/sections needed? Specific transitions or motion styles to avoid? Should it loop, or have a clear end frame?

Remotion-specific coding guidance for applying this brief (transition implementation patterns, editorial type-scale minimums, etc.) lives in the `remotion-best-practices` skill's `rules/art-direction.md` — consult it whenever writing the actual animation code.
