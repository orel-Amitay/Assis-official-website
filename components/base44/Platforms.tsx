"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AssisHeartMark from "@/components/AssisHeartMark";
import { BookDemoButton } from "@/components/DemoModal";

const SHOPIFY_APP_URL = "https://apps.shopify.com/assis-care";

const MOBILE_LOGOS = [
  { src: "/brand/shopify.svg", label: "Shopify" },
  { src: "/brand/pay-stripe.svg", label: "Stripe" },
  { src: "/brand/ship-ups.svg", label: "UPS" },
  { src: "/brand/acq-meta.svg", label: "Meta" },
  { src: "/brand/woocommerce.svg", label: "WooCommerce" },
  { src: "/brand/pay-paypal.svg", label: "PayPal" },
  { src: "/brand/ship-fedex.svg", label: "FedEx" },
  { src: "/brand/acq-google.svg", label: "Google" },
  { src: "/brand/wix.svg", label: "Wix" },
  { src: "/brand/pay-klarna.svg", label: "Klarna" },
  { src: "/brand/ship-dhl.svg", label: "DHL" },
  { src: "/brand/acq-tiktok.svg", label: "TikTok" },
] as const;

/** Irregular constellation around Assis (not perfect rings) */
const FIELD = [
  {
    src: "/brand/shopify.svg",
    label: "Shopify",
    className: "left-[8%] top-[22%] h-8 w-8 sm:left-[12%] sm:top-[18%] sm:h-10 sm:w-10",
    opacity: 0.55,
    motion: "animate-float-slow",
    delay: "0s",
  },
  {
    src: "/brand/pay-stripe.svg",
    label: "Stripe",
    className: "right-[10%] top-[18%] h-7 w-7 sm:right-[14%] sm:top-[14%] sm:h-9 sm:w-9",
    opacity: 0.5,
    motion: "animate-float",
    delay: "0.5s",
  },
  {
    src: "/brand/ship-ups.svg",
    label: "UPS",
    className: "left-[3%] top-[48%] h-7 w-7 sm:left-[6%] sm:top-[46%] sm:h-9 sm:w-9",
    opacity: 0.48,
    motion: "animate-float-alt",
    delay: "1.1s",
  },
  {
    src: "/brand/acq-meta.svg",
    label: "Meta",
    className: "right-[4%] top-[44%] h-7 w-7 sm:right-[7%] sm:top-[42%] sm:h-9 sm:w-9",
    opacity: 0.48,
    motion: "animate-float-slow",
    delay: "0.3s",
  },
  {
    src: "/brand/woocommerce.svg",
    label: "WooCommerce",
    className: "left-[14%] bottom-[16%] h-7 w-7 sm:left-[18%] sm:bottom-[20%] sm:h-8 sm:w-8",
    opacity: 0.45,
    motion: "animate-float",
    delay: "0.8s",
  },
  {
    src: "/brand/pay-paypal.svg",
    label: "PayPal",
    className: "right-[12%] bottom-[14%] h-7 w-7 sm:right-[16%] sm:bottom-[18%] sm:h-8 sm:w-8",
    opacity: 0.45,
    motion: "animate-float-alt",
    delay: "1.4s",
  },
  {
    src: "/brand/ship-fedex.svg",
    label: "FedEx",
    className: "left-[28%] top-[10%] h-6 w-6 sm:left-[30%] sm:top-[8%] sm:h-8 sm:w-8",
    opacity: 0.42,
    motion: "animate-float",
    delay: "1.7s",
  },
  {
    src: "/brand/acq-google.svg",
    label: "Google",
    className: "right-[26%] top-[9%] h-6 w-6 sm:right-[28%] sm:top-[7%] sm:h-8 sm:w-8",
    opacity: 0.42,
    motion: "animate-float-slow",
    delay: "0.9s",
  },
  {
    src: "/brand/wix.svg",
    label: "Wix",
    className: "hidden left-[22%] top-[62%] h-6 w-6 sm:block sm:h-7 sm:w-7",
    opacity: 0.4,
    motion: "animate-float-alt",
    delay: "0.2s",
  },
  {
    src: "/brand/pay-klarna.svg",
    label: "Klarna",
    className: "hidden right-[20%] top-[60%] h-6 w-6 sm:block sm:h-7 sm:w-7",
    opacity: 0.4,
    motion: "animate-float",
    delay: "1.2s",
  },
  {
    src: "/brand/ship-dhl.svg",
    label: "DHL",
    className: "hidden left-[6%] top-[30%] h-6 w-6 lg:block",
    opacity: 0.38,
    motion: "animate-float-slow",
    delay: "1.9s",
  },
  {
    src: "/brand/acq-tiktok.svg",
    label: "TikTok",
    className: "hidden right-[5%] top-[30%] h-6 w-6 lg:block",
    opacity: 0.38,
    motion: "animate-float-alt",
    delay: "0.6s",
  },
  {
    src: "/brand/bigcommerce.svg",
    label: "BigCommerce",
    className: "hidden left-[38%] bottom-[10%] h-6 w-6 sm:block",
    opacity: 0.36,
    motion: "animate-float",
    delay: "1.5s",
  },
  {
    src: "/brand/ship-amazon.svg",
    label: "Amazon",
    className: "hidden right-[36%] bottom-[9%] h-6 w-6 sm:block",
    opacity: 0.36,
    motion: "animate-float-slow",
    delay: "0.4s",
  },
  {
    src: "/brand/magento.svg",
    label: "Magento",
    className: "hidden left-[32%] top-[28%] h-5 w-5 lg:block",
    opacity: 0.32,
    motion: "animate-float-alt",
    delay: "1.0s",
  },
  {
    src: "/brand/ship-shipbob.svg",
    label: "ShipBob",
    className: "hidden right-[30%] top-[30%] h-5 w-5 lg:block",
    opacity: 0.32,
    motion: "animate-float",
    delay: "1.6s",
  },
  {
    src: "/brand/squarespace.svg",
    label: "Squarespace",
    className: "hidden left-[34%] bottom-[22%] h-5 w-5 lg:block",
    opacity: 0.3,
    motion: "animate-float-slow",
    delay: "0.7s",
  },
  {
    src: "/brand/ship-usps.svg",
    label: "USPS",
    className: "hidden right-[32%] bottom-[24%] h-5 w-5 lg:block",
    opacity: 0.3,
    motion: "animate-float-alt",
    delay: "1.3s",
  },
] as const;

function LogoMark({
  src,
  label,
  className = "",
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`block bg-[hsl(var(--on-surface-variant))] ${className}`}
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

function FieldMark({
  src,
  label,
  className,
  opacity,
  motion: floatClass,
  delay,
  index,
  visible,
}: {
  src: string;
  label: string;
  className: string;
  opacity: number;
  motion: string;
  delay: string;
  index: number;
  visible: boolean;
}) {
  return (
    <motion.span
      className={`absolute text-[hsl(var(--on-surface-variant))] ${className}`}
      title={label}
      initial={{ opacity: 0, scale: 0 }}
      animate={visible ? { opacity, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 16,
        mass: 0.7,
        delay: 0.12 + index * 0.055,
      }}
    >
      <span
        className={`block h-full w-full ${visible ? floatClass : ""}`}
        style={{ animationDelay: delay }}
      >
        <span
          role="img"
          aria-label={label}
          className="block h-full w-full bg-current"
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
      </span>
    </motion.span>
  );
}

function ShopifyMark() {
  return (
    <span
      className="inline-block h-4 w-4 bg-current"
      style={{
        maskImage: "url(/brand/shopify.svg)",
        WebkitMaskImage: "url(/brand/shopify.svg)",
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

export default function Platforms() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const inView = useInView(fieldRef, { once: true, amount: 0.35 });

  return (
    <section id="platforms" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-28">
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
        <div>
          <h2 className="font-headline text-center text-[1.75rem] font-bold tracking-[-0.04em] text-[hsl(var(--on-surface))] sm:text-5xl">
            Works where your store already lives.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-[hsl(var(--on-surface-variant))] sm:text-base">
            Shopify first. Payments, ads, and carriers around it. Assis sits in the middle.
          </p>
          <p className="mx-auto mt-2 max-w-md text-center text-xs text-[hsl(var(--on-surface-variant)/0.7)]">
            Live on Shopify now. Other platforms via demo.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-2.5 min-[400px]:flex-row min-[400px]:items-center sm:mt-12 sm:gap-2.5">
          <a
            href={SHOPIFY_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-gradient inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 sm:h-10"
          >
            <ShopifyMark />
            Install on Shopify
          </a>
          <BookDemoButton className="inline-flex h-11 items-center justify-center rounded-full border border-[hsl(var(--outline-variant)/0.4)] bg-white/60 px-5 text-sm font-semibold text-[hsl(var(--on-surface))] transition-colors hover:bg-white sm:h-10">
            Book a demo
          </BookDemoButton>
        </div>

        <div className="mt-10 sm:hidden">
          <div className="mx-auto max-w-sm">
            <div className="grid grid-cols-4 gap-x-3 gap-y-5">
              {MOBILE_LOGOS.slice(0, 4).map((logo) => (
                <div key={logo.label} className="flex justify-center">
                  <LogoMark src={logo.src} label={logo.label} className="h-7 w-7 opacity-55" />
                </div>
              ))}
            </div>
            <div className="my-6 flex flex-col items-center justify-center">
              <AssisHeartMark size={48} animate={false} glowing={false} />
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
                Assis
              </p>
            </div>
            <div className="grid grid-cols-4 gap-x-3 gap-y-5">
              {MOBILE_LOGOS.slice(4).map((logo) => (
                <div key={logo.label} className="flex justify-center">
                  <LogoMark src={logo.src} label={logo.label} className="h-7 w-7 opacity-55" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={fieldRef}
          className="relative mx-auto mt-10 hidden h-[400px] w-full max-w-2xl sm:mt-14 sm:block"
        >
          {FIELD.map((item, i) => (
            <FieldMark key={item.label} {...item} index={i} visible={inView} />
          ))}

          <motion.div
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.05 }}
          >
            <AssisHeartMark size={56} animate={false} glowing={false} />
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
              Assis
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
