"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type AssisHeartMarkProps = {
  size?: number;
  className?: string;
  animate?: boolean;
  glowing?: boolean;
  pulse?: boolean;
};

export default function AssisHeartMark({
  size = 44,
  className = "",
  animate = true,
  glowing = true,
  pulse = true,
}: AssisHeartMarkProps) {
  const img = (
    <Image
      src="/brand/assis-heart-classic.png"
      alt="Assis"
      width={size}
      height={Math.round(size * 0.966)}
      unoptimized
      className="object-contain drop-shadow-[0_8px_24px_rgba(29,111,238,0.35)]"
      style={{ width: size, height: "auto" }}
      priority
    />
  );

  const body = (
    <>
      {glowing && (
        <motion.span
          className="absolute inset-0 scale-125 rounded-full bg-assis-blue/30 blur-xl"
          aria-hidden
          animate={pulse ? { opacity: [0.35, 0.7, 0.35], scale: [1.1, 1.35, 1.1] } : undefined}
          transition={pulse ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : undefined}
        />
      )}
      <motion.span
        className="relative"
        animate={pulse ? { y: [0, -3, 0], scale: [1, 1.04, 1] } : undefined}
        transition={pulse ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        {img}
      </motion.span>
    </>
  );

  if (!animate) {
    return (
      <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
        {body}
      </span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
    >
      {body}
    </motion.span>
  );
}
