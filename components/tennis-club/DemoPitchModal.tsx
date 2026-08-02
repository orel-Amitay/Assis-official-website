"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "assis-demo-pitch-seen-v2";
const COACH_STYLE_ID = "assis-heart-coach-style";

const LOSSES = [
  {
    value: "67%",
    line: "of shoppers leave if AI / chat doesn’t answer right away",
  },
  {
    value: "20-40%",
    line: "of high-intent traffic never converts without instant help",
  },
  {
    value: "Hours",
    line: "of your team’s day spent repeating the same product questions",
  },
];

function injectHeartCoachStyles() {
  if (document.getElementById(COACH_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = COACH_STYLE_ID;
  style.textContent = `
    .fixed-heart-btn.assis-heart-spotlight {
      z-index: 90 !important;
      animation: assis-heart-pulse 1.7s ease-in-out infinite !important;
      filter: drop-shadow(0 0 0 rgba(29,111,238,0)) !important;
    }
    .fixed-heart-btn.assis-heart-spotlight::before,
    .fixed-heart-btn.assis-heart-spotlight::after {
      content: "";
      position: absolute;
      inset: -10px;
      border-radius: 999px;
      border: 2px solid rgba(29, 111, 238, 0.45);
      pointer-events: none;
      animation: assis-heart-ring 1.7s ease-out infinite;
    }
    .fixed-heart-btn.assis-heart-spotlight::after {
      animation-delay: 0.55s;
      border-color: rgba(29, 111, 238, 0.28);
    }
    @keyframes assis-heart-pulse {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(29,111,238,0)); }
      50% { transform: scale(1.08); filter: drop-shadow(0 10px 24px rgba(29,111,238,0.45)); }
    }
    @keyframes assis-heart-ring {
      0% { transform: scale(0.85); opacity: 0.9; }
      100% { transform: scale(1.55); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function setHeartSpotlight(on: boolean) {
  injectHeartCoachStyles();
  const hearts = document.querySelectorAll(".fixed-heart-btn");
  hearts.forEach((node) => {
    node.classList.toggle("assis-heart-spotlight", on);
  });
}

export default function DemoPitchModal() {
  const [open, setOpen] = useState(false);
  const [coach, setCoach] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    const timer = window.setTimeout(() => setOpen(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!coach) {
      setHeartSpotlight(false);
      return;
    }
    setHeartSpotlight(true);
    const observer = new MutationObserver(() => setHeartSpotlight(true));
    observer.observe(document.body, { childList: true, subtree: true });
    const hide = window.setTimeout(() => {
      setCoach(false);
      setHeartSpotlight(false);
    }, 12000);
    return () => {
      observer.disconnect();
      window.clearTimeout(hide);
      setHeartSpotlight(false);
    };
  }, [coach]);

  const dismissPitch = (showCoach: boolean) => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    if (showCoach) {
      window.setTimeout(() => setCoach(true), 280);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-[#0b1220]/50 backdrop-blur-[7px]"
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dismissPitch(true)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="assis-demo-pitch-title"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-[22px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.28)]"
            >
              <div className="relative overflow-hidden px-6 pb-2 pt-6 sm:px-7 sm:pt-7">
                <div
                  className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#1d6fee]/10 blur-2xl"
                  aria-hidden
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-[#ebf3ff] ring-1 ring-[#1d6fee]/15">
                      <Image
                        src="/brand/assis-heart.png"
                        alt="Assis"
                        fill
                        sizes="44px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d6fee]">
                        Assis AI
                      </p>
                      <p className="text-sm text-muted">What you lose without it</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissPitch(true)}
                    className="rounded-full px-2 py-1 text-muted transition hover:bg-stone hover:text-foreground"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <h2
                  id="assis-demo-pitch-title"
                  className="font-display relative mt-6 text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-foreground sm:text-[1.9rem]"
                >
                  Every unanswered shopper
                  <span className="block text-[#1d6fee]">is money walking out.</span>
                </h2>
                <p className="relative mt-3 text-[15px] leading-relaxed text-muted">
                  Without AI on your site, questions sit. Interest cools. Carts die.
                  Assis answers instantly: product, sizing, shipping, while your
                  brand stays personal.
                </p>
              </div>

              <div className="space-y-5 px-6 pb-6 pt-4 sm:px-7 sm:pb-7">
                <div className="overflow-hidden rounded-2xl border border-border">
                  {LOSSES.map((item, i) => (
                    <div
                      key={item.value}
                      className={`flex items-start gap-4 px-4 py-3.5 ${
                        i < LOSSES.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <p className="font-display min-w-[4.75rem] text-xl font-semibold tracking-tight text-[#1d6fee]">
                        {item.value}
                      </p>
                      <p className="pt-0.5 text-sm leading-snug text-foreground/75">
                        {item.line}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-2.5">
                  <button
                    type="button"
                    onClick={() => dismissPitch(true)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1d6fee] px-5 text-sm font-semibold text-white transition hover:bg-[#0a3fa8]"
                  >
                    <span aria-hidden>💙</span>
                    Try the Assis heart
                  </button>
                  <a
                    href="https://assis.care"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => dismissPitch(false)}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition hover:bg-stone"
                  >
                    Get 14 days free on your store
                  </a>
                </div>

                <p className="text-center text-[11px] leading-relaxed text-muted">
                  Tap the glowing heart below. Talk to the AI like a real shopper.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {coach ? (
          <motion.div
            initial={{ opacity: 0, y: 12, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none fixed bottom-[7.5rem] right-5 z-[85] sm:bottom-[8.25rem] sm:right-7"
          >
            <div className="relative max-w-[220px] rounded-2xl bg-[#0b1220] px-4 py-3 text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8eb7ff]">
                Try me
              </p>
              <p className="mt-1 text-sm leading-snug text-white/90">
                Click the Assis heart. Ask anything a shopper would ask.
              </p>
              <span
                className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 bg-[#0b1220]"
                aria-hidden
              />
            </div>
            <motion.div
              className="mt-2 flex justify-end pr-6 text-[#1d6fee]"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
                <path
                  d="M9 2v20M9 22l-5-5M9 22l5-5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
