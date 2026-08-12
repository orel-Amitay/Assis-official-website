"use client";

import ScrollReveal from "@/components/ScrollReveal";

const PAIRS = [
  {
    brand: "Order status",
    customer: "My money",
    brandLine: "You see an order moving through fulfillment.",
    customerLine: "They see money spent and no package yet.",
    visual: "order" as const,
  },
  {
    brand: "Return policy",
    customer: "No way out",
    brandLine: "You see the rules that protect margin.",
    customerLine: "They feel stuck when their situation doesn’t fit.",
    visual: "policy" as const,
  },
  {
    brand: "3-5 business days",
    customer: "A promise",
    brandLine: "You see a shipping window.",
    customerLine: "They see the day they expected their package.",
    visual: "shipping" as const,
  },
  {
    brand: "Refund",
    customer: "Lost trust",
    brandLine: "You see money leaving the order.",
    customerLine: "They decide if they’ll ever buy from you again.",
    visual: "refund" as const,
  },
  {
    brand: "Out of stock",
    customer: "Lost sale",
    brandLine: "You see an inventory count.",
    customerLine: "They leave to find it somewhere else.",
    visual: "stock" as const,
  },
  {
    brand: "Support ticket",
    customer: "My problem",
    brandLine: "You see one more item in the queue.",
    customerLine: "For them, it’s the only thing that matters right now.",
    visual: "ticket" as const,
  },
] as const;

function PairVisual({ type }: { type: (typeof PAIRS)[number]["visual"] }) {
  if (type === "order") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100/80 p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Ops
          </span>
          <div className="mt-2 space-y-1">
            <div className="h-1.5 w-full rounded-full bg-zinc-200" />
            <div className="h-1.5 w-[70%] rounded-full bg-zinc-200" />
            <div className="mt-1.5 text-[10px] font-semibold text-zinc-500">
              In transit
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-assis-blue">
            Customer
          </span>
          <div className="mt-2">
            <p className="text-[10px] font-semibold text-foreground">Where is it?</p>
            <p className="mt-0.5 text-[10px] text-zinc-500">$186 charged · waiting</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "policy") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100/80 p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Policy
          </span>
          <ul className="mt-2 space-y-1 text-[10px] text-zinc-500">
            <li>· 14 days</li>
            <li>· Tags on</li>
            <li>· Receipt</li>
          </ul>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-assis-blue">
            Feeling
          </span>
          <p className="mt-2 text-[10px] font-semibold text-foreground">
            This doesn’t fit my case
          </p>
          <span className="mt-2 inline-block rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-zinc-500 shadow-sm">
            Stuck
          </span>
        </div>
      </div>
    );
  }

  if (type === "shipping") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100/80 p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Window
          </span>
          <p className="mt-3 font-display text-lg font-bold tracking-tight text-zinc-400">
            3-5
          </p>
          <p className="text-[10px] text-zinc-500">business days</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-assis-blue">
            Expectation
          </span>
          <p className="mt-3 font-display text-lg font-bold tracking-tight text-assis-blue">
            Friday
          </p>
          <p className="text-[10px] text-zinc-500">the day they counted on</p>
        </div>
      </div>
    );
  }

  if (type === "refund") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100/80 p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Ledger
          </span>
          <p className="mt-3 text-sm font-semibold text-zinc-500">−$128</p>
          <p className="text-[10px] text-zinc-400">refund issued</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-assis-blue">
            Trust
          </span>
          <p className="mt-3 text-[10px] font-semibold text-foreground">
            Will I buy again?
          </p>
          <span className="mt-2 inline-block rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-zinc-500 shadow-sm">
            At risk
          </span>
        </div>
      </div>
    );
  }

  if (type === "stock") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100/80 p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Inventory
          </span>
          <p className="mt-3 font-display text-lg font-bold text-zinc-400">0</p>
          <p className="text-[10px] text-zinc-500">units left</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-assis-blue">
            Shopper
          </span>
          <p className="mt-3 text-[10px] font-semibold text-foreground">Left for a competitor</p>
          <span className="mt-2 inline-block rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-zinc-500 shadow-sm">
            Lost sale
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100/80 p-3">
        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
          Queue
        </span>
        <div className="mt-2 space-y-1">
          {["#1842", "#1843", "#1844"].map((id) => (
            <div
              key={id}
              className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-zinc-400 shadow-sm"
            >
              {id}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] p-3">
        <span className="text-[9px] font-bold uppercase tracking-wider text-assis-blue">
          Reality
        </span>
        <p className="mt-3 text-[10px] font-semibold leading-snug text-foreground">
          This is the only problem that matters right now
        </p>
      </div>
    </div>
  );
}

export default function Relationship() {
  return (
    <section id="position" className="scroll-mt-20 px-5 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            Why Assis
          </p>
          <h2 className="mt-4 font-display text-center text-[1.75rem] font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            Businesses optimize operations.
            <br />
            Customers remember experiences.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-relaxed text-zinc-500 sm:text-base">
            Assis protects both - by managing the relationship between what your business knows
            and what your customers feel.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-12 max-w-4xl sm:mt-16">
          <div className="mb-6 hidden grid-cols-[1fr_1.15fr] gap-8 sm:mb-8 sm:grid lg:gap-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              What the business sees
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue">
              What the customer feels
            </p>
          </div>

          <ul className="space-y-4 sm:space-y-5">
            {PAIRS.map((p, i) => (
              <ScrollReveal key={p.brand} delay={0.04 * i}>
                <li className="overflow-hidden rounded-[1.5rem] border border-zinc-100 bg-white p-5 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.18)] sm:rounded-[1.75rem] sm:p-6">
                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
                    <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
                      <div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 sm:hidden">
                          What the business sees
                        </p>
                        <p className="font-display text-lg font-bold tracking-[-0.02em] text-zinc-500 sm:text-xl">
                          {p.brand}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                          {p.brandLine}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-assis-blue sm:hidden">
                          What the customer feels
                        </p>
                        <p className="font-display text-lg font-bold tracking-[-0.02em] text-foreground sm:text-xl">
                          {p.customer}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                          {p.customerLine}
                        </p>
                      </div>
                    </div>
                    <PairVisual type={p.visual} />
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ul>

          <ScrollReveal className="mt-10 text-center sm:mt-12">
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
              When those worlds stay aligned, trust grows - and so does the business.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
