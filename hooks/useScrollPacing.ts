"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useScrollRoot } from "@/components/ScrollRoot";
import {
  scrollActiveIndex,
  scrollContainerHeight,
  SCROLL_STEP_COUNT,
} from "@/lib/scroll-pacing";

export function useScrollPacing(stepCount = SCROLL_STEP_COUNT) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRoot = useScrollRoot();
  const [active, setActive] = useState(0);
  const [fill, setFill] = useState(0);

  const { scrollYProgress } = useScroll({
    container: scrollRoot ?? undefined,
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const clamped = Math.min(1, Math.max(0, value));
    setFill(clamped);
    setActive(scrollActiveIndex(clamped, stepCount));
  });

  return {
    containerRef,
    active,
    fill,
    containerStyle: { height: `${scrollContainerHeight(stepCount)}vh` } as const,
  };
}
