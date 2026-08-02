"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import AssisHeartMark from "@/components/AssisHeartMark";

type Layer = {
  role: string;
  logos: { src: string; label: string }[];
};

const LEFT: Layer[] = [
  {
    role: "Store",
    logos: [
      { src: "/brand/shopify.svg", label: "Shopify" },
      { src: "/brand/woocommerce.svg", label: "WooCommerce" },
      { src: "/brand/wix.svg", label: "Wix" },
    ],
  },
  {
    role: "Fulfillment",
    logos: [
      { src: "/brand/ship-ups.svg", label: "UPS" },
      { src: "/brand/ship-fedex.svg", label: "FedEx" },
      { src: "/brand/ship-dhl.svg", label: "DHL" },
    ],
  },
];

const RIGHT: Layer[] = [
  {
    role: "Payments",
    logos: [
      { src: "/brand/pay-stripe.svg", label: "Stripe" },
      { src: "/brand/pay-paypal.svg", label: "PayPal" },
      { src: "/brand/pay-klarna.svg", label: "Klarna" },
    ],
  },
  {
    role: "Acquisition",
    logos: [
      { src: "/brand/acq-meta.svg", label: "Meta" },
      { src: "/brand/acq-google.svg", label: "Google" },
      { src: "/brand/acq-tiktok.svg", label: "TikTok" },
    ],
  },
];

function LogoMark({ src, label }: { src: string; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="inline-block h-4 w-4 bg-zinc-500 sm:h-5 sm:w-5"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

function SideColumn({ layer }: { layer: Layer }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
        {layer.role}
      </p>
      <div className="mt-4 flex items-center justify-center gap-3.5 sm:gap-4">
        {layer.logos.map((l) => (
          <LogoMark key={l.label} src={l.src} label={l.label} />
        ))}
      </div>
    </div>
  );
}

export default function Category() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setReveal(true), 500);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section id="category" className="scroll-mt-20 px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-5xl" ref={ref}>
        <ScrollReveal>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            The category
          </p>
          <h2 className="mt-4 font-display text-center text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            Your tech stack isn&rsquo;t the problem.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-zinc-500">
            Every layer manages a transaction. The layer between brand and customer is still empty.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 items-center gap-x-4 gap-y-10 sm:mt-16 sm:grid-cols-5 sm:gap-x-6">
          {LEFT.map((layer) => (
            <SideColumn key={layer.role} layer={layer} />
          ))}

          <div className="col-span-2 flex flex-col items-center text-center sm:col-span-1">
            <p
              className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${
                reveal ? "text-assis-blue" : "text-zinc-400"
              }`}
            >
              Relationship
            </p>
            <div className="mt-3 flex min-h-[40px] items-center justify-center">
              {reveal ? (
                <div className="animate-float">
                  <AssisHeartMark size={40} animate={false} glowing={false} />
                </div>
              ) : (
                <span className="font-display text-2xl font-semibold text-zinc-300">?</span>
              )}
            </div>
            <p
              className={`mt-2 text-xs font-medium transition-colors duration-500 ${
                reveal ? "text-foreground" : "text-zinc-400"
              }`}
            >
              {reveal ? "Assis" : "Missing"}
            </p>
          </div>

          {RIGHT.map((layer) => (
            <SideColumn key={layer.role} layer={layer} />
          ))}
        </div>

        <ScrollReveal delay={0.15} className="mt-14 text-center sm:mt-16">
          <p className="font-display text-xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
            Your stack manages the transaction.
            <br />
            <span className="text-assis-blue">Assis manages the relationship.</span>
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Not software you operate. An operation we run.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
