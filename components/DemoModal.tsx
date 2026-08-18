"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=972552600950&text&type=phone_number&app_absent=0";

function WhatsAppHint() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-assis-blue/15 bg-assis-blue-light px-4 py-3 transition-colors hover:border-assis-blue/30 hover:bg-assis-blue-light/80"
    >
      <Image
        src="/brand/assis-heart-whatsapp.png"
        alt=""
        width={36}
        height={35}
        unoptimized
        aria-hidden
        className="shrink-0"
      />
      <p className="text-left text-xs leading-relaxed text-foreground/65 sm:text-sm">
        <span className="font-semibold text-assis-blue">Always here for you.</span> Tap the blue
        heart at the bottom right anytime to chat with us on WhatsApp.
      </p>
    </a>
  );
}

const DemoModalCtx = createContext<{
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}>({ open: false, openModal: () => {}, closeModal: () => {} });

export function DemoModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <DemoModalCtx.Provider value={{ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }}>
      {children}
      <DemoModal />
    </DemoModalCtx.Provider>
  );
}

export function useDemoModal() {
  return useContext(DemoModalCtx);
}

export function BookDemoButton({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { openModal } = useDemoModal();

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        openModal();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

type State = "idle" | "loading" | "success" | "error";

function DemoModal() {
  const { open, closeModal } = useDemoModal();
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "" });

  function reset() {
    setState("idle");
    setForm({ name: "", email: "", company: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  function handleClose() {
    closeModal();
    setTimeout(reset, 400);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] flex items-end justify-center p-0 sm:items-center sm:p-4"
          >
            <div className="max-h-[min(92dvh,40rem)] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:p-8 sm:pb-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Book a demo</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Leave your details and we&rsquo;ll get back within 24 hours.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              {state === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2 className="h-7 w-7 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-lg font-bold text-foreground">Got it!</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We&rsquo;ll reach out within 24 hours to set up a time.
                  </p>
                  <div className="mt-5">
                    <WhatsAppHint />
                  </div>
                  <button
                    onClick={handleClose}
                    className="mt-6 rounded-xl bg-zinc-100 px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-zinc-200"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-zinc-50 px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 outline-none focus:border-assis-blue focus:bg-white transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Work email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-zinc-50 px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 outline-none focus:border-assis-blue focus:bg-white transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Company name"
                    required
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-zinc-50 px-4 py-3 text-sm text-foreground placeholder:text-zinc-400 outline-none focus:border-assis-blue focus:bg-white transition-all"
                  />
                  <WhatsAppHint />
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="mt-1 w-full rounded-xl bg-assis-blue px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_-4px_rgba(29,111,238,0.45)] transition-all hover:bg-assis-blue-deep disabled:opacity-60"
                  >
                    {state === "loading" ? "Sending…" : "Send request"}
                  </button>
                  {state === "error" && (
                    <p className="text-center text-xs text-red-500">
                      Something went wrong. Email us at{" "}
                      <a href="mailto:orel@assis.care" className="underline">orel@assis.care</a>
                    </p>
                  )}
                  <p className="text-center text-xs text-zinc-400">
                    No lock-in. You pay when we deliver results.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
