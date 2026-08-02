"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/catalog";

export default function CartDrawer() {
  const { items, open, setOpen, removeItem, updateQty, subtotal, clear } =
    useCart();

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <button
        type="button"
        aria-label="Close cart"
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <h2 className="text-sm font-medium tracking-[0.2em]">CART</h2>
          <button type="button" className="p-2" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">
              Your cart is empty.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4">
                  <Link
                    href={`/products/${item.productHandle}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden bg-stone"
                    onClick={() => setOpen(false)}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.productHandle}`}
                      className="text-sm font-medium leading-snug"
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted">{item.variantTitle}</p>
                    <p className="mt-1 text-sm">{formatMoney(item.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="inline-flex items-center border border-border">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm"
                          onClick={() => updateQty(item.key, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm"
                          onClick={() => updateQty(item.key, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-xs tracking-wide text-muted underline"
                        onClick={() => removeItem(item.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="tracking-[0.12em] text-muted">SUBTOTAL</span>
            <span className="font-medium">{formatMoney(subtotal)}</span>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-muted">
            Made to order. Please allow 2–3 weeks. Shipping calculated at checkout
            on the live store.
          </p>
          <a
            href="https://tennisclubfinejewelry.com/cart"
            target="_blank"
            rel="noreferrer"
            className={`flex w-full items-center justify-center bg-foreground py-3.5 text-[11px] font-semibold tracking-[0.18em] text-white transition hover:bg-sage ${
              items.length === 0 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            CHECKOUT
          </a>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full text-center text-xs text-muted underline"
            >
              Clear cart
            </button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
