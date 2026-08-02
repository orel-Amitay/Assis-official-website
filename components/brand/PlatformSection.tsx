"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const ROWS = [
  {
    label: "Commerce",
    logos: [
      { src: "/brand/shopify.svg", label: "Shopify" },
      { src: "/brand/woocommerce.svg", label: "WooCommerce" },
      { src: "/brand/wix.svg", label: "Wix" },
      { src: "/brand/bigcommerce.svg", label: "BigCommerce" },
    ],
  },
  {
    label: "Channels",
    logos: [
      { src: "/brand/channel-whatsapp.svg", label: "WhatsApp" },
      { src: "/brand/channel-instagram.svg", label: "Instagram" },
      { src: "/brand/channel-messenger.svg", label: "Messenger" },
      { src: "/brand/channel-email.svg", label: "Email" },
      { src: "/brand/channel-imessage.svg", label: "iMessage" },
    ],
  },
  {
    label: "Ops & growth",
    logos: [
      { src: "/brand/pay-stripe.svg", label: "Stripe" },
      { src: "/brand/pay-paypal.svg", label: "PayPal" },
      { src: "/brand/ship-ups.svg", label: "UPS" },
      { src: "/brand/ship-fedex.svg", label: "FedEx" },
      { src: "/brand/acq-meta.svg", label: "Meta" },
      { src: "/brand/acq-google.svg", label: "Google" },
    ],
  },
] as const;

const NAMES = [
  "Shopify",
  "WhatsApp",
  "Instagram",
  "Messenger",
  "Email",
  "Gorgias",
  "Zendesk",
  "HubSpot",
  "Salesforce",
];

export default function PlatformSection() {
  return (
    <section id="platform" className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-assis-blue">
            Platform
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
            Works where your business already works.
          </h2>
        </ScrollReveal>

        <div className="mt-14 space-y-8">
          {ROWS.map((row, i) => (
            <ScrollReveal key={row.label} delay={0.06 * i}>
              <div className="rounded-2xl border border-border/70 bg-white/70 px-5 py-6 sm:px-8">
                <p className="mb-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  {row.label}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
                  {row.logos.map((p) => (
                    <div
                      key={p.label}
                      className="flex flex-col items-center gap-2 opacity-75 transition hover:opacity-100"
                    >
                      <Image
                        src={p.src}
                        alt={p.label}
                        width={36}
                        height={36}
                        className="h-9 w-9 object-contain"
                      />
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.15} className="mt-10">
          <p className="text-center text-sm font-medium leading-relaxed text-muted-foreground">
            {NAMES.join(" · ")} · And more.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
