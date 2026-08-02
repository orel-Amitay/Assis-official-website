"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=972559995038&text&type=phone_number&app_absent=0";

const HEART_WIDTH = 72;
const HEART_HEIGHT = Math.round(HEART_WIDTH * (989 / 1024));

export default function WhatsAppHeart() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Assis on WhatsApp"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 block scale-90 sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:right-[max(1.25rem,env(safe-area-inset-right))] sm:scale-100"
    >
      <span className="relative inline-flex items-center justify-center">
        {/* Soft blue glow underneath */}
        <motion.span
          className="pointer-events-none absolute left-1/2 top-[58%] h-10 w-14 -translate-x-1/2 rounded-full bg-assis-blue/55 blur-xl"
          aria-hidden
          animate={{ opacity: [0.45, 0.85, 0.45], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="pointer-events-none absolute left-1/2 top-[58%] h-7 w-10 -translate-x-1/2 rounded-full bg-assis-blue/40 blur-md"
          aria-hidden
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.25, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        />

        {/* Pumping heart */}
        <motion.span
          className="relative"
          animate={{ scale: [1, 1.08, 1, 1.05, 1] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.4, 0.55, 1],
          }}
        >
          <Image
            src="/brand/assis-heart-whatsapp.png"
            alt="Contact Assis on WhatsApp"
            width={HEART_WIDTH}
            height={HEART_HEIGHT}
            unoptimized
            className="relative drop-shadow-[0_8px_20px_rgba(29,111,238,0.45)]"
          />
        </motion.span>
      </span>
    </motion.a>
  );
}
