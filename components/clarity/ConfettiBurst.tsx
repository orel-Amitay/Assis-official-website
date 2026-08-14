"use client";

import { useEffect, useRef } from "react";

type Kind = "heart" | "assis" | "dot";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotate: number;
  vr: number;
  life: number;
  decay: number;
  kind: Kind;
};

const COLORS = [
  "#1d6fee",
  "#4d90f7",
  "#60a5fa",
  "#f43f5e",
  "#fb7185",
  "#ec4899",
  "#f472b6",
  "#f59e0b",
  "#fbbf24",
  "#34d399",
  "#2dd4bf",
  "#22d3ee",
  "#a78bfa",
  "#c084fc",
  "#fb923c",
  "#ef4444",
];

const ASSIS_HEART = "/brand/assis-heart-classic.png";

function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s * 1.15, -s * 0.35, -s * 0.55, -s * 1.15, 0, -s * 0.55);
  ctx.bezierCurveTo(s * 0.55, -s * 1.15, s * 1.15, -s * 0.35, 0, s * 0.35);
  ctx.closePath();
  ctx.fill();
}

function spawn(width: number, height: number, big: boolean): Particle[] {
  const count = big ? 260 : 140;
  const origins = big
    ? [
        { x: width * 0.5, y: height * 0.36 },
        { x: width * 0.22, y: height * 0.28 },
        { x: width * 0.78, y: height * 0.28 },
        { x: width * 0.5, y: height * 0.18 },
      ]
    : [
        { x: width * 0.5, y: height * 0.34 },
        { x: width * 0.32, y: height * 0.26 },
        { x: width * 0.68, y: height * 0.26 },
      ];

  return Array.from({ length: count }, (_, i) => {
    const origin = origins[i % origins.length]!;
    const angle = Math.random() * Math.PI * 2;
    const speed = (big ? 7 : 5) + Math.random() * (big ? 14 : 10);
    const roll = Math.random();
    const kind: Kind = roll > 0.82 ? "assis" : roll > 0.12 ? "heart" : "dot";
    return {
      x: origin.x + (Math.random() - 0.5) * 40,
      y: origin.y + (Math.random() - 0.5) * 24,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (big ? 9 : 6),
      size: kind === "dot" ? 3 + Math.random() * 4 : kind === "assis" ? 14 + Math.random() * 12 : 8 + Math.random() * 14,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      rotate: Math.random() * 360,
      vr: -10 + Math.random() * 20,
      life: 1,
      decay: 0.006 + Math.random() * 0.006,
      kind,
    };
  });
}

export default function ConfettiBurst({
  fire,
  big = false,
}: {
  fire: number;
  big?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartImg = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = ASSIS_HEART;
    heartImg.current = img;
  }, []);

  useEffect(() => {
    if (!fire) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width, height };
    };

    const { width, height } = fit();
    const particles = spawn(width, height, big);
    const img = heartImg.current;
    let frame = 0;
    let raf = 0;

    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.vx *= 0.992;
        p.rotate += p.vr;
        p.life -= p.decay;
        if (p.life <= 0) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotate * Math.PI) / 180);
        if (p.kind === "assis" && img?.complete && img.naturalWidth > 0) {
          const s = p.size;
          ctx.drawImage(img, -s / 2, -s / 2, s, s * 0.96);
        } else if (p.kind === "dot") {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          drawHeart(ctx, p.size);
        }
        ctx.restore();
      }
      if (frame < 220) raf = window.requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, width, height);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [fire, big]);

  if (!fire) return null;
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[80]"
      aria-hidden
    />
  );
}
