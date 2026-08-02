const PLATFORMS = [
  { src: "/brand/shopify.svg", label: "Shopify" },
  { src: "/brand/woocommerce.svg", label: "WooCommerce" },
  { src: "/brand/wix.svg", label: "Wix" },
  { src: "/brand/magento.svg", label: "Magento" },
  { src: "/brand/bigcommerce.svg", label: "BigCommerce" },
  { src: "/brand/squarespace.svg", label: "Squarespace" },
  { src: "/brand/pay-stripe.svg", label: "Stripe" },
  { src: "/brand/pay-paypal.svg", label: "PayPal" },
  { src: "/brand/pay-klarna.svg", label: "Klarna" },
  { src: "/brand/ship-ups.svg", label: "UPS" },
  { src: "/brand/ship-fedex.svg", label: "FedEx" },
  { src: "/brand/ship-dhl.svg", label: "DHL" },
] as const;

function PlatformMark({ src, label }: { src: string; label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2.5 px-5 sm:gap-3 sm:px-7">
      <span
        role="img"
        aria-label={label}
        className="block h-5 w-5 bg-zinc-400 sm:h-6 sm:w-6"
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
      <span className="text-sm font-medium tracking-tight text-zinc-400 sm:text-[15px]">
        {label}
      </span>
    </span>
  );
}

export default function PlatformMarquee() {
  const loop = [...PLATFORMS, ...PLATFORMS];

  return (
    <div className="w-full overflow-hidden py-5 sm:py-6">
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[hsl(230_100%_98%)] to-transparent sm:w-20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[hsl(230_100%_98%)] to-transparent sm:w-20"
          aria-hidden
        />
        <div className="animate-marquee flex w-max items-center">
          {loop.map((p, i) => (
            <PlatformMark key={`${p.label}-${i}`} src={p.src} label={p.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
