"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQS = [
  {
    q: "What does Assis actually do for my store?",
    a: "Assis sits between your store and your shoppers: sales questions before checkout, order issues and WISMO after purchase, and refunds turned into exchanges or store credit. AI is always in the stack. With Powered, your team runs it. With Care, our team runs it for you. Growth adds reports and monthly business reviews on top of Care.",
  },
  {
    q: "What’s the difference between Powered, Care, and Growth?",
    a: "Powered is AI + inbox for your team. Care is the same system with Assis operating the conversations. Growth is Care plus a business layer: reports from live chats, product and ops signals, and a monthly strategy meeting. Most stores start on Care.",
  },
  {
    q: "Is this a chatbot?",
    a: "No. Assis is a customer relationship operation, not another ticket tool. AI handles volume so shoppers get answers fast. When a real person is needed, your team — or ours on Care — steps in. The goal is fewer lost sales and fewer refunds walking out the door.",
  },
  {
    q: "How is this different from Gorgias / Zendesk / Intercom?",
    a: "Helpdesk tools organize tickets. Assis owns the outcome: convert the chat, protect revenue, keep trust. We measure success in conversion, refunds saved, and Google ratings, not only response time.",
  },
  {
    q: "Does Assis work if I’m not on Shopify?",
    a: "Shopify is live today. Install from the App Store. Other platforms (Woo, Wix, and more) work through a demo so we connect the right stack for your store.",
  },
  {
    q: "What channels does Assis cover?",
    a: "WhatsApp, Instagram, Messenger, email, SMS/iMessage, and your site chat. Shoppers meet Assis where they already message you.",
  },
  {
    q: "How fast can we go live?",
    a: "On Shopify, Powered can be live in minutes: install the app, connect channels, and conversations start flowing. Care and Growth we set up with you on the demo so the handoff feels right for your store.",
  },
  {
    q: "How do you price?",
    a: "It depends on the plan. Powered is a simple monthly plan. Care is priced by conversation volume. Growth is custom on top of Care. No lock-in — we’ll map the right fit on the demo.",
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
            Questions store owners ask.
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
