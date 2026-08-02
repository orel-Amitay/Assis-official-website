"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X, ChevronDown } from "lucide-react";
import { NAV } from "@/lib/catalog";
import { useCart } from "./CartProvider";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    const root = document.getElementById("app-scroll");
    if (!root) return;
    const onScroll = () => setScrolled(root.scrollTop > 12);
    onScroll();
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.getElementById("app-scroll");
    if (!root) return;
    if (open) root.style.overflow = "hidden";
    else root.style.overflow = "";
    return () => {
      root.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        <div className="relative mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-4 sm:h-[84px] sm:px-6 lg:px-10">
          <div className="flex w-20 items-center sm:w-28">
            <button
              type="button"
              className="inline-flex p-2 lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <Link
              href="/search"
              className="hidden p-2 text-foreground/80 transition hover:text-foreground lg:inline-flex"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.4} />
            </Link>
          </div>

          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="font-display block text-[22px] font-normal tracking-[0.08em] sm:text-[28px] sm:tracking-[0.06em]">
              TENNIS CLUB
            </span>
            <span className="mt-0.5 block text-[9px] font-medium tracking-[0.42em] text-foreground/70 sm:text-[10px] sm:tracking-[0.48em]">
              FINE JEWELRY
            </span>
          </Link>

          <div className="flex w-20 items-center justify-end gap-0.5 sm:w-28 sm:gap-1">
            <Link
              href="/search"
              className="inline-flex p-2 text-foreground/80 transition hover:text-foreground lg:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.4} />
            </Link>
            <Link
              href="/account/login"
              className="hidden p-2 text-foreground/80 transition hover:text-foreground sm:inline-flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" strokeWidth={1.4} />
            </Link>
            <button
              type="button"
              className="relative p-2 text-foreground/80 transition hover:text-foreground"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
              {count > 0 ? (
                <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-foreground px-1 text-[9px] text-white">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-transparent lg:block">
          <ul className="mx-auto flex max-w-[1400px] items-center justify-center gap-1 px-4 pb-3 sm:gap-2 lg:px-10">
            {NAV.map((link) => (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  setOpenMenu("children" in link ? link.label : null)
                }
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 px-3 py-2 text-[11px] font-medium tracking-[0.18em] text-foreground/85 transition hover:text-foreground"
                >
                  {link.label}
                  {"children" in link ? (
                    <ChevronDown className="h-3 w-3 opacity-50" strokeWidth={1.5} />
                  ) : null}
                </Link>
                {"children" in link && openMenu === link.label ? (
                  <div className="absolute left-1/2 top-full z-50 min-w-[220px] -translate-x-1/2 border border-border bg-white py-3 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-5 py-2 text-center text-[11px] tracking-[0.14em] text-foreground/75 transition hover:bg-stone/60 hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-y border-border/80 bg-[#f3f3f3]">
          <p className="px-4 py-2 text-center text-[11px] tracking-[0.06em] text-foreground/80 sm:text-xs">
            Made to order. Please allow 2-3 weeks{" "}
            <span aria-hidden className="ml-0.5">
              →
            </span>
          </p>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-white transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="font-display text-sm tracking-[0.2em]">TENNIS CLUB</span>
            <button
              type="button"
              aria-label="Close menu"
              className="p-2"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            {NAV.map((link) => (
              <div key={link.label} className="border-b border-border/70 py-2">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-[12px] font-medium tracking-[0.16em]"
                >
                  {link.label}
                </Link>
                {"children" in link
                  ? link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block px-5 py-2 text-[11px] tracking-[0.12em] text-muted"
                      >
                        {child.label}
                      </Link>
                    ))
                  : null}
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
