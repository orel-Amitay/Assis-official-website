"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const WHATSAPP_URL = "https://wa.me/972552600950";

export default function WhatsAppFab() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center sm:bottom-8 sm:right-8"
      animate={{
        scale: [1, 1.06, 1],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span className="absolute inset-0 rounded-full bg-[hsl(var(--primary)/0.2)] blur-md" />
      <Image
        src="/base44/40c60beea_Hereforyou2.png"
        alt=""
        width={56}
        height={56}
        unoptimized
        className="relative h-14 w-14 drop-shadow-lg"
      />
    </motion.a>
  );
}
