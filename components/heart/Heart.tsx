"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HEART_CRACK_BRANCH, HEART_CRACK_PATH, HEART_VIEWBOX } from "./heart-paths";
import Particles from "./Particles";

export type HeartState = "idle" | "cracked" | "healed" | "strong" | "faded";

interface HeartProps {
  state?: HeartState;
  size?: number;
  pulse?: boolean;
  particles?: boolean;
  className?: string;
}

const STATE_CONFIG: Record<
  HeartState,
  { glow: number; scale: number; crack: number; filter: string }
> = {
  idle: { glow: 0.55, scale: 1, crack: 0, filter: "none" },
  cracked: { glow: 0.4, scale: 1.02, crack: 1, filter: "none" },
  healed: { glow: 0.75, scale: 1.04, crack: 0, filter: "none" },
  strong: { glow: 1, scale: 1.1, crack: 0, filter: "saturate(1.15) brightness(1.05)" },
  faded: { glow: 0.1, scale: 0.94, crack: 0, filter: "grayscale(1) brightness(0.55)" },
};

export default function Heart({
  state = "idle",
  size = 280,
  pulse = true,
  particles = false,
  className = "",
}: HeartProps) {
  const cfg = STATE_CONFIG[state];

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {particles && <Particles radius={size * 0.6} count={14} />}

      <motion.div
        animate={{ scale: cfg.scale, filter: cfg.filter }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <motion.div
          animate={pulse ? { scale: [1, 1.035, 1] } : { scale: 1 }}
          transition={
            pulse
              ? { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
          className="relative h-full w-full"
        >
          {/* outer glow halo */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full"
            animate={{ opacity: cfg.glow }}
            transition={{ duration: 1.2 }}
            style={{
              background:
                "radial-gradient(circle, rgba(0,75,204,0.55) 0%, rgba(0,75,204,0.18) 45%, transparent 75%)",
              filter: "blur(18px)",
            }}
          />

          <motion.div
            className="relative h-full w-full"
            animate={{
              opacity: state === "faded" ? 0.6 : 1,
              filter: `drop-shadow(0 0 ${10 + cfg.glow * 28}px rgba(0,75,204,${
                0.35 + cfg.glow * 0.45
              }))`,
            }}
            transition={{ duration: 1 }}
          >
            <Image
              src="/brand/assis-heart.png"
              alt="ASSIS heart"
              fill
              sizes={`${size}px`}
              className="object-contain"
              priority
            />
          </motion.div>

          {/* crack + light leak overlay */}
          <motion.svg
            viewBox={HEART_VIEWBOX}
            className="pointer-events-none absolute inset-0 h-full w-full"
            initial={false}
            animate={{ opacity: cfg.crack }}
            transition={{ duration: 0.5 }}
          >
            <path
              d={HEART_CRACK_PATH}
              fill="none"
              stroke="#eaf6ff"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 6px rgba(234,246,255,0.95))" }}
            />
            <path
              d={HEART_CRACK_BRANCH}
              fill="none"
              stroke="#eaf6ff"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.8}
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
