"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/store";
import { FiArrowRight, FiCheckCircle, FiMail, FiMapPin, FiShoppingCart, FiTruck } from "react-icons/fi";
import { placeOrder } from "@/lib/actions";
import { useDictionary } from "@/components/DictionaryProvider";

export default function CheckoutPage() {
  const { dict, lang } = useDictionary();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, clear } = useCart();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError(dict.checkout.addressRequired);
      return;
    }

    setLoading(true);
    const res = await placeOrder({
      address,
      email: email.trim() || undefined,
      items: items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price })),
    });
    setLoading(false);

    if (!res.ok) {
      setError(res.error ?? dict.checkout.genericError);
      return;
    }

    clear();
    setDone(true);
  }

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="mb-3 font-display text-3xl text-ink">{dict.checkout.loginFirst}</h1>
        <p className="mb-8 text-sm text-ink/60">
          {dict.checkout.loginRequiredDesc}
        </p>
        <Link
          href={`/${lang}/login`}
          className="inline-block rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {dict.checkout.loginBtn}
        </Link>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="mb-4 text-5xl">✅</div>
        <h1 className="mb-2 font-display text-3xl text-ink">{dict.checkout.orderSuccess}</h1>
        <p className="mb-8 text-sm text-ink/60">
          {dict.checkout.orderSuccessDesc}
        </p>
        <button
          onClick={() => router.push(`/${lang}`)}
          className="rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {dict.checkout.backToShop}
        </button>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="mb-6 text-sm text-ink/60">{dict.checkout.cartEmpty}</p>
        <button
          onClick={() => router.push(`/${lang}`)}
          className="rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {dict.checkout.backToShop}
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 md:px-8 py-10 md:py-16 relative">
      <Link href={`/${lang}`} className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 text-ink/70 font-bold hover:text-girls transition-colors">
        <FiArrowRight className="text-xl" />
        العودة للمتجر
      </Link>
      
      <div className="mb-10 text-center mt-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-girls to-boys text-white mb-4 shadow-lg">
          <FiShoppingCart className="text-3xl" />
        </div>
        <h1 className="font-display text-4xl text-ink">{dict.checkout.pageTitle}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        {/* ملخص الطلب - الفاتورة */}
        <div className="rounded-[32px] border border-line bg-white p-6 md:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* ديكور علوي للفاتورة */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-girls to-boys" />
          
          <h2 className="text-xl font-black text-ink mb-6 flex items-center gap-2">
            ملخص الطلب
          </h2>
          
          <ul className="mb-6 space-y-4">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between items-center text-[15px]">
                <span className="text-ink/80">{i.name} <span className="text-ink/40 text-xs mx-1">×</span> <span className="font-bold text-ink">{i.quantity}</span></span>
                <span className="font-bold text-ink">{i.price * i.quantity} {dict.common.egp}</span>
              </li>
            ))}
          </ul>
          
          <div className="border-t-2 border-dashed border-line pt-6">
            <div className="flex justify-between items-end">
              <span className="text-ink/60 font-bold">{dict.checkout.total}</span>
              <div className="text-right">
                <span className="block text-4xl font-black bg-gradient-to-r from-girls to-boys bg-clip-text text-transparent pb-1">
                  {total}
                </span>
                <span className="text-sm font-bold text-ink/50">{dict.common.egp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* نموذج البيانات */}
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-line bg-surface p-6 md:p-8 shadow-sm space-y-6">
          <div className="rounded-2xl bg-background p-4 border border-line/50">
            <p className="text-[15px] leading-relaxed text-ink/70">
              {dict.checkout.deliverTo} <span className="font-black text-ink">{session?.user?.name}</span> {dict.checkout.onNumber}{" "}
              <span className="font-black text-ink" dir="ltr">{session?.user?.phone}</span>
            </p>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
                <FiMail className="text-girls text-lg" />
                {dict.checkout.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.checkout.emailPlaceholder}
                className="w-full rounded-2xl border-2 border-line bg-white px-5 py-3.5 text-[15px] transition-colors focus:border-girls focus:outline-none focus:ring-4 focus:ring-girls/10"
                dir="ltr"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
                <FiMapPin className="text-boys text-lg" />
                {dict.checkout.addressLabel}
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={dict.checkout.addressPlaceholder}
                rows={3}
                className="w-full rounded-2xl border-2 border-line bg-white px-5 py-3.5 text-[15px] transition-colors focus:border-boys focus:outline-none focus:ring-4 focus:ring-boys/10 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white text-green-600 shadow-sm">
              <FiTruck className="text-xl" />
            </div>
            <div>
              <p className="font-bold text-green-800">{dict.checkout.cod}</p>
              <p className="text-xs text-green-700/70 mt-0.5">الدفع بكل أمان عند استلام طلبك</p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-2xl bg-ink p-4 font-bold text-white transition-all hover:shadow-[0_8px_25px_rgba(216,27,96,0.3)] disabled:opacity-60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-girls to-boys opacity-90 transition-opacity group-hover:opacity-100" />
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
              {loading ? dict.checkout.confirming : dict.checkout.confirmOrder}
              {!loading && <FiCheckCircle className="text-xl opacity-80" />}
            </span>
          </button>
        </form>
      </div>
    </main>
  );
}
