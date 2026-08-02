"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  key: string;
  productHandle: string;
  title: string;
  image: string;
  price: string;
  variantId: number;
  variantTitle: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "key" | "quantity"> & { quantity?: number }) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "tennis-club-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce(
      (sum, i) => sum + Number(i.price) * i.quantity,
      0,
    );
    return {
      items,
      count,
      open,
      setOpen,
      addItem: (item) => {
        const key = `${item.productHandle}:${item.variantId}`;
        setItems((prev) => {
          const existing = prev.find((p) => p.key === key);
          if (existing) {
            return prev.map((p) =>
              p.key === key
                ? { ...p, quantity: p.quantity + (item.quantity ?? 1) }
                : p,
            );
          }
          return [
            ...prev,
            { ...item, key, quantity: item.quantity ?? 1 },
          ];
        });
        setOpen(true);
      },
      removeItem: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
      updateQty: (key, quantity) =>
        setItems((prev) =>
          prev
            .map((i) => (i.key === key ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        ),
      clear: () => setItems([]),
      subtotal,
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
