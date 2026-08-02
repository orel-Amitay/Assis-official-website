"use client";

import ScrollReveal from "@/components/ScrollReveal";
import AssisHeartMark from "@/components/AssisHeartMark";

const PAIRS = [
  {
    brand: "Order status",
    customer: "My money",
    brandLine: "You see an order moving through fulfillment.",
    customerLine: "They see money spent and no package yet.",
  },
  {
    brand: "Return policy",
    customer: "No way out",
    brandLine: "You see the rules that protect your business.",
    customerLine: "They feel stuck when their situation doesn’t fit the policy.",
  },
  {
    brand: "3-5 business days",
    customer: "A promise",
    brandLine: "You see a shipping window.",
    customerLine: "They see the day they expected their package.",
  },
  {
    brand: "Refund",
    customer: "Lost trust",
    brandLine: "You see money leaving the order.",
    customerLine: "They decide if they’ll ever buy from you again.",
  },
  {
    brand: "Out of stock",
    customer: "Lost sale",
    brandLine: "You see an inventory count.",
    customerLine: "They leave your store to find it somewhere else.",
  },
  {
    brand: "Support ticket",
    customer: "My problem",
    brandLine: "You see one more conversation in the queue.",
    customerLine: "For them, it’s the only problem that matters right now.",
  },
] as const;

export default function Relationship() {
  return (
    <section id="position" className="scroll-mt-20 px-5 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            Why Assis
          </p>
          <h2 className="mt-4 font-display text-center text-[1.75rem] font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            You run the store. Assis runs the customer side.
          </h2>
        </ScrollReveal>

        <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <div className="mb-6 hidden grid-cols-2 gap-12 sm:mb-8 sm:grid">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              What you see
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue">
              What your customer experiences
            </p>
          </div>

          <ul className="divide-y divide-zinc-200/70">
            {PAIRS.map((p) => (
              <li key={p.brand} className="grid gap-5 py-6 sm:grid-cols-2 sm:gap-12 sm:py-7">
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 sm:hidden">
                    What you see
                  </p>
                  <p className="font-display text-lg font-bold tracking-[-0.02em] text-zinc-500 sm:text-xl">
                    {p.brand}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{p.brandLine}</p>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-assis-blue sm:hidden">
                    What your customer experiences
                  </p>
                  <p className="font-display text-lg font-bold tracking-[-0.02em] text-foreground sm:text-xl">
                    {p.customer}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{p.customerLine}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-center text-center sm:mt-14">
            <AssisHeartMark size={40} animate={false} glowing={false} />
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-assis-blue">
              Assis
            </p>
            <p className="mt-3 max-w-md font-display text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
              Same order.
              <br />
              Two completely different experiences.
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              Assis sits between your store and your shoppers — operated by your team, or by ours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
