"use client";

import ScrollReveal from "@/components/ScrollReveal";

const ROWS = [
  { left: "Order #4821", right: "I trusted you." },
  { left: "Delivered", right: "No one helped." },
  { left: "Refund", right: "Never again." },
];

export default function Problem() {
  return (
    <section id="problem" className="scroll-mt-20 bg-[#09090b] px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="font-display text-center text-3xl font-bold leading-[1.1] tracking-[-0.035em] text-white sm:text-5xl">
            Ecommerce sees orders.
            <br />
            <span className="text-zinc-500">Customers experience relationships.</span>
          </h2>
        </ScrollReveal>

        <div className="mt-12 space-y-3 sm:mt-14">
          {ROWS.map((row, i) => (
            <ScrollReveal key={row.left} delay={0.06 + i * 0.08}>
              <div className="grid grid-cols-2 overflow-hidden rounded-2xl">
                <div className="bg-white/[0.04] px-4 py-5 sm:px-6 sm:py-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                    You see
                  </p>
                  <p className="mt-2 font-display text-base font-semibold text-zinc-400 sm:text-xl">
                    {row.left}
                  </p>
                </div>
                <div className="bg-assis-blue/15 px-4 py-5 sm:px-6 sm:py-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-assis-blue-soft">
                    They feel
                  </p>
                  <p className="mt-2 font-display text-base font-semibold text-white sm:text-xl">
                    &ldquo;{row.right}&rdquo;
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="mt-12 text-center sm:mt-14">
          <p className="font-display text-2xl font-bold tracking-[-0.03em] text-assis-blue-soft sm:text-4xl">
            The gap costs more than the refund.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
