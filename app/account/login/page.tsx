"use client";

import { useState } from "react";
import Link from "next/link";
import SiteShell from "@/components/tennis-club/SiteShell";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16">
        <h1 className="font-display text-center text-2xl tracking-[0.22em]">LOGIN</h1>
        <p className="mt-3 text-center text-sm text-muted">
          Access order history, shipping details, and warranty information.
        </p>
        <form
          className="mt-10 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(
              "This is a demo storefront replica. Account login is not connected to a live backend.",
            );
          }}
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[11px] tracking-[0.14em]">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[11px] tracking-[0.14em]">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-foreground"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-foreground py-3.5 text-[11px] font-semibold tracking-[0.18em] text-white transition hover:bg-sage"
          >
            SIGN IN
          </button>
        </form>
        {message ? <p className="mt-4 text-center text-sm text-muted">{message}</p> : null}
        <p className="mt-8 text-center text-sm text-muted">
          Need help?{" "}
          <Link href="/pages/customer-service" className="underline">
            Customer Service
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
