"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

const ScrollRootCtx = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useScrollRoot() {
  return useContext(ScrollRootCtx);
}

export function ScrollRoot({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <ScrollRootCtx.Provider value={ref}>
      <div
        id="app-scroll"
        ref={ref}
        className="h-[100dvh] overflow-x-hidden overflow-y-auto overscroll-none"
      >
        {children}
      </div>
    </ScrollRootCtx.Provider>
  );
}
