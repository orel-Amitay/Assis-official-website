"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";

export default function ClarityAuthForm({
  lang,
  callbackUrl,
  compact = false,
}: {
  lang: ClarityLang;
  callbackUrl?: string;
  compact?: boolean;
}) {
  const t = COPY[lang];
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const nextUrl = callbackUrl || "/clarity";

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/auth/providers")
      .then((response) => (response.ok ? response.json() : null))
      .then((providers: Record<string, unknown> | null) => {
        if (!cancelled) setGoogleReady(Boolean(providers?.google));
      })
      .catch(() => {
        if (!cancelled) setGoogleReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "register") {
        const response = await fetch("/api/clarity/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = (await response.json()) as { error?: string; code?: string };
        if (!response.ok) {
          if (data.code === "taken") setError(t.authTaken);
          else if (data.code === "weak-password") setError(t.authWeakPassword);
          else if (data.code === "invalid-username") setError(t.authInvalidUsername);
          else if (response.status === 503) setError(t.authNoDatabase);
          else setError(data.error || t.authFailed);
          return;
        }
      }
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: nextUrl,
      });
      if (result?.error) {
        setError(mode === "register" ? t.authFailed : t.authBadLogin);
        return;
      }
      window.location.href = nextUrl;
    } catch {
      setError(t.authFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {googleReady ? (
        <>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: nextUrl })}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-assis-blue text-sm font-semibold text-white transition hover:bg-assis-blue-deep"
          >
            {lang === "he" ? (
              <span>
                המשיכו עם <span dir="ltr">Google</span>
              </span>
            ) : (
              t.signInGoogle
            )}
          </button>
          <p className="text-center text-[12px] text-zinc-400">{t.authOr}</p>
        </>
      ) : null}
      <div className="inline-flex w-full rounded-full bg-[#f4f5f7] p-0.5">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-1.5 text-[12px] font-medium ${
            mode === "login" ? "bg-white text-foreground shadow-sm" : "text-zinc-500"
          }`}
        >
          {t.authLogin}
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-full py-1.5 text-[12px] font-medium ${
            mode === "register" ? "bg-white text-foreground shadow-sm" : "text-zinc-500"
          }`}
        >
          {t.authRegister}
        </button>
      </div>
      <form className="space-y-2" onSubmit={(e) => void submit(e)}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t.authUsername}
          autoComplete="username"
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-3.5 text-start text-base text-foreground outline-none placeholder:text-zinc-400 focus:border-assis-blue/40 focus:ring-4 focus:ring-assis-blue/10"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.authPassword}
          type="password"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-3.5 text-start text-base text-foreground outline-none placeholder:text-zinc-400 focus:border-assis-blue/40 focus:ring-4 focus:ring-assis-blue/10"
        />
        {error ? <p className="text-[12px] text-amber-800">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || !username.trim() || !password}
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-500"
        >
          {busy ? t.authWorking : mode === "register" ? t.authRegisterCta : t.authLoginCta}
        </button>
      </form>
    </div>
  );
}
