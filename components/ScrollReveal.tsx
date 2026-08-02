"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { REVEAL_DURATION, REVEAL_EASE } from "@/lib/scroll-pacing";

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

export default function ScrollReveal({
  children,
  delay = 0,
  y = 32,
  transition,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{
        duration: REVEAL_DURATION + 0.1,
        delay,
        ease: REVEAL_EASE,
        ...transition,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
