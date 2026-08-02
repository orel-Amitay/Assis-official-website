import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0F1419] px-5 py-14 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/base44/af6b42f42_Assis-HeartLogo.png"
                alt="Assis"
                width={28}
                height={28}
                unoptimized
                className="h-7 w-7 brightness-0 invert"
              />
              <span className="font-headline text-lg font-bold">Assis</span>
            </div>
            <address className="mt-5 not-italic text-sm leading-relaxed text-white/60">
              28 Geary St STE 650, 585
              <br />
              San Francisco, CA 94108
              <br />
              United States
            </address>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                Product
              </p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <a href="#packages" className="transition hover:text-white">
                    Packages
                  </a>
                </li>
                <li>
                  <a href="#results" className="transition hover:text-white">
                    Results
                  </a>
                </li>
                <li>
                  <a href="#platforms" className="transition hover:text-white">
                    Platforms
                  </a>
                </li>
                <li>
                  <a href="#behind-the-scenes" className="transition hover:text-white">
                    Scenarios
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                Customers
              </p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <a href="#testimonials" className="transition hover:text-white">
                    Stories
                  </a>
                </li>
                <li>
                  <a
                    href="https://apps.shopify.com/assis-care"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white"
                  >
                    Shopify App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                Company
              </p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <Link href="/privacy-policy" className="transition hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a
                    href="https://onboarding.assis.care/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white"
                  >
                    Business Login
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          © 2026 Assis Business
        </div>
      </div>
    </footer>
  );
}
