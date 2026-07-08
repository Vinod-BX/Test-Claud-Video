// String-slicing reveal (typewriter-style) — never per-character opacity,
// per rules/text-animations.md.
export const sliceTextByProgress = (text: string, progress: number): string =>
  text.slice(0, Math.round(text.length * Math.max(0, Math.min(1, progress))));
