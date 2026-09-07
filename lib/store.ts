"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// CartItem.emoji should be a serializable value (emoji string or image URL),
// not a ReactNode which is not serializable and causes hydration issues.
export type CartItem = {
  id: string;
  name: string;
  price: number;
  // either an emoji character like "✨" or an image URL
  emoji?: string | null;
  quantity: number;
};

type AddItemPayload = { id: string; name: string; price: number; emoji?: string | null };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddItemPayload) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (item) =>
        set((state) => {
          // Basic validation: ensure price is a finite non-negative number
          const price = Number(item.price);
          if (!Number.isFinite(price) || price < 0) {
            console.warn("addItem called with invalid price", item);
            return state;
          }

          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }], isOpen: true };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "lamsa-cart-storage",
    }
  )
);
