"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

interface ParticlesProps {
  count?: number;
  radius?: number;
  className?: string;
}

function buildParticles(count: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + i * 0.6;
    const dist = radius * (0.55 + ((i * 37) % 45) / 100);
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    const size = 2 + ((i * 17) % 4);
    const duration = 5 + ((i * 13) % 6);
    const delay = (i * 0.41) % 4;
    return { x, y, size, duration, delay };
  });
}

export default function Particles({
  count = 16,
  radius = 160,
  className = "",
}: ParticlesProps) {
  const isClient = useIsClient();

  if (!isClient) return null;

  const particles = buildParticles(count, radius);

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
      aria-hidden
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-assis-blue-soft"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: "0 0 8px rgba(95,176,255,0.9), 0 0 16px rgba(0,75,204,0.6)",
          }}
          initial={{ x: p.x, y: p.y, opacity: 0 }}
          animate={{
            x: [p.x, p.x * 1.15, p.x],
            y: [p.y, p.y - 18, p.y],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
