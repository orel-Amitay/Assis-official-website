/** Shared scroll-driven section pacing - keep all step sections in sync. */
export const SCROLL_STEP_COUNT = 3;
/** Taller scroll runway = smoother handoff between steps */
export const SCROLL_CONTAINER_VH = 520;
export const SCROLL_STICKY_TOP_CLASS = "top-16 sm:top-20";
export const SCROLL_PROGRESS_TRANSITION = { duration: 0.55, ease: "easeOut" as const };

export const SCROLL_CROSSFADE_SPREAD = 0.72;
export const SCROLL_CROSSFADE_Y = 10;

export const REVEAL_DURATION = 0.75;
export const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

export function scrollContainerHeight(stepCount = SCROLL_STEP_COUNT) {
  return (SCROLL_CONTAINER_VH / SCROLL_STEP_COUNT) * stepCount;
}

export function scrollActiveIndex(fill: number, stepCount = SCROLL_STEP_COUNT) {
  const clamped = Math.min(1, Math.max(0, fill));
  const segment = 1 / stepCount;
  return Math.min(stepCount - 1, Math.max(0, Math.floor(clamped / segment)));
}

export function tabProgress(
  index: number,
  active: number,
  fill: number,
  stepCount = SCROLL_STEP_COUNT,
) {
  if (index < active) return 100;
  if (index > active) return 0;
  const segmentStart = index / stepCount;
  const segmentSize = 1 / stepCount;
  return Math.min(100, Math.max(0, ((fill - segmentStart) / segmentSize) * 100));
}

export function crossfadeVisuals(index: number, fill: number, count = SCROLL_STEP_COUNT) {
  const segment = 1 / count;
  const center = (index + 0.5) * segment;
  const spread = segment * SCROLL_CROSSFADE_SPREAD;

  let opacity = Math.max(0, 1 - Math.abs(fill - center) / spread);
  opacity = opacity * opacity * (3 - 2 * opacity);

  if (index === 0 && fill < center) {
    opacity = Math.max(opacity, 1 - fill / (spread * 0.55));
  }
  if (index === count - 1 && fill > center) {
    opacity = Math.max(opacity, 1 - (1 - fill) / (spread * 0.55));
  }

  const y = (fill * count - index - 0.5) * SCROLL_CROSSFADE_Y;

  return { opacity, y };
}
