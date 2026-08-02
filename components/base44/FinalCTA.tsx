"use client";

import { BookDemoButton } from "@/components/DemoModal";
import { scrollToSection } from "./scrollToSection";

export default function FinalCTA() {
  return (
    <section className="mx-5 mb-16 overflow-hidden rounded-3xl sm:mx-8 lg:px-0 lg:mx-10">
      <div className="gradient-blue relative px-6 py-16 text-center sm:px-12 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15), transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
            Own every moment with your shoppers
          </p>
          <h2 className="mt-4 font-headline text-3xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.75rem]">
            Build trust. Protect margin. Grow sales.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Start with Powered, Trusted, or Grow — and see results in the KPIs you already
            manage: conversion, cancellations, returns, and repeat buyers.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BookDemoButton className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[hsl(var(--primary))] shadow-lg transition hover:bg-white/95">
              Book a demo
            </BookDemoButton>
            <button
              type="button"
              onClick={() => scrollToSection("packages")}
              className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Compare packages
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
