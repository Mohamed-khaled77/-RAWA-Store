"use client";

import { useCart } from "@/lib/store";
import Link from "next/link";
import { FiX, FiShoppingBag } from "react-icons/fi";
import { useDictionary } from "@/components/DictionaryProvider";

export default function CartDrawer() {
  const { dict, lang } = useDictionary();
  const { items, isOpen, closeCart, removeItem, setQuantity } = useCart();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={closeCart}
        aria-hidden="true"
      />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl text-ink">{dict.cartPage.title}</h2>
          <button
            onClick={closeCart}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white"
          >
          <FiX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="pt-10 text-center text-sm text-ink/50">
              {dict.cartPage.empty} <span className="inline-block align-middle"><FiShoppingBag /></span>
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white p-3"
                >
                  <div className="flex h-14 w-14 flex-none items-center justify-center rounded-lg bg-background text-2xl">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{item.name}</div>
                    <div className="text-[13px] text-ink font-bold">
                      {item.price} {dict.common.egp}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-sm"
                        aria-label="تقليل الكمية"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-sm"
                        aria-label="زيادة الكمية"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove"
                    className="text-xs text-ink/40"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm font-bold">
              <span>{dict.cartPage.total}</span>
              <span className="text-ink text-lg">{total} {dict.common.egp}</span>
            </div>
            <Link
              href={`/${lang}/checkout`}
              onClick={closeCart}
              className="block w-full rounded-xl bg-ink py-3.5 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {dict.cartPage.checkout}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
