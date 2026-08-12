"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQS = [
  {
    q: "What does Assis actually do for my store?",
    a: "Assis manages the customer side of your e-commerce business. Before checkout, that means turning hesitation into purchases. After the order, that means protecting trust and keeping revenue in the store. Across the shopping journey, Assis surfaces what customers need - so operations improve with the experience.",
  },
  {
    q: "What’s the difference between Powered, Trusted, and Grow?",
    a: "They are three levels of ownership of the same operating layer. Powered: Assis runs customer interactions while your team stays in control. Trusted: Assis becomes the operational team managing your customer relationships. Grow: Assis turns what happens on the customer side into better business decisions. Most brands start on Trusted.",
  },
  {
    q: "Is this a chatbot?",
    a: "No. Chatbots answer questions. Helpdesks organize tickets. Assis manages the relationship between your business and your customers - measured in conversion, revenue protected, trust, and better decisions.",
  },
  {
    q: "How is this different from Gorgias / Zendesk / Intercom?",
    a: "Those tools organize support work. Assis is the operating layer for the customer side of the business. Success is conversion, refunds prevented, and customers who come back - not only response time.",
  },
  {
    q: "Does Assis work if I’m not on Shopify?",
    a: "Shopify is live today. Install from the App Store. Other platforms work through a demo so we connect the right stack for your brand.",
  },
  {
    q: "Where do customers reach Assis?",
    a: "Wherever they already message you: WhatsApp, Instagram, Messenger, email, SMS/iMessage, and site chat. One customer side. Every channel.",
  },
  {
    q: "How fast can we go live?",
    a: "On Shopify, Powered can be live in minutes. Trusted and Grow are set up with you on the demo so ownership of the customer side matches how your brand operates.",
  },
  {
    q: "How do you price?",
    a: "Powered is a simple monthly plan. Trusted is priced by interaction volume. Grow is custom on top of Trusted. No lock-in - we’ll map the right fit on the demo.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 px-5 py-14 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal className="mb-10 text-center sm:mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            FAQ
          </p>
          <h2 className="mt-4 font-display text-[1.75rem] font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            Questions operators ask.
          </h2>
        </ScrollReveal>

        <div className="mx-auto max-w-3xl divide-y divide-zinc-200/80 border-y border-zinc-200/80">
          {FAQS.map((faq, i) => (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
              >
                <span className="pr-1 font-display text-[15px] font-semibold tracking-[-0.02em] text-foreground sm:text-lg">
                  {faq.q}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition-all duration-200 ${
                    open === i
                      ? "rotate-45 border-assis-blue text-assis-blue"
                      : "border-zinc-200 text-zinc-400"
                  }`}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-sm leading-relaxed text-zinc-500 sm:text-[15px]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
