"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertOfferBanner } from "@/lib/actions";

type OfferBannerProps = {
  banner: {
    title: string;
    titleEn: string | null;
    subtitle: string | null;
    subtitleEn: string | null;
    buttonText: string | null;
    buttonTextEn: string | null;
    imageUrl: string | null;
    isActive: boolean;
  } | null;
  offerProducts: { id: string; name: string; price: number; discountPrice: number | null }[];
};

export default function OfferBannerAdmin({ banner, offerProducts }: OfferBannerProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: banner?.title ?? "",
    titleEn: banner?.titleEn ?? "",
    subtitle: banner?.subtitle ?? "",
    subtitleEn: banner?.subtitleEn ?? "",
    buttonText: banner?.buttonText ?? "تسوق العروض",
    buttonTextEn: banner?.buttonTextEn ?? "Shop Offers",
    imageUrl: banner?.imageUrl ?? "",
    isActive: banner?.isActive ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleImageSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setForm({ ...form, imageUrl: data.url });
      else setError(data.error);
    } catch (err) {
      setError("فشل الرفع");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await upsertOfferBanner({
      title: form.title,
      titleEn: form.titleEn,
      subtitle: form.subtitle,
      subtitleEn: form.subtitleEn,
      buttonText: form.buttonText,
      buttonTextEn: form.buttonTextEn,
      imageUrl: form.imageUrl,
      isActive: form.isActive,
    });

    if (res.ok) {
      setMessage("تم حفظ البانر بنجاح");
      router.refresh();
    } else {
      setError(res.error || "حصل خطأ");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">إدارة العروض والبانر</h1>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 rounded-xl border border-line bg-white p-5 md:grid-cols-2">
        <h2 className="text-xl font-bold md:col-span-2">إعدادات بانر الرئيسية</h2>
        
        <input
          placeholder="عنوان العرض (مثلاً: عروض الشتاء)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
          required
        />
        <input
          placeholder="عنوان العرض إنجليزي (e.g: Winter Offers)"
          value={form.titleEn}
          onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
        />
        
        <input
          placeholder="وصف أو تفاصيل قصيرة (عربي)"
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
        />
        <input
          placeholder="وصف أو تفاصيل قصيرة (إنجليزي)"
          value={form.subtitleEn}
          onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
        />

        <input
          placeholder="نص الزر عربي (مثلاً: تسوق الآن)"
          value={form.buttonText}
          onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
        />
        <input
          placeholder="نص الزر إنجليزي (مثلاً: Shop Now)"
          value={form.buttonTextEn}
          onChange={(e) => setForm({ ...form, buttonTextEn: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
        />

        <div className="md:col-span-2 flex items-center justify-between border-t border-line pt-4">
          <label className="flex items-center gap-2 font-bold cursor-pointer text-ink">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-5 w-5 rounded border-line text-plum focus:ring-plum"
            />
            تفعيل وعرض البانر في الصفحة الرئيسية
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-ink">صورة البانر (اختياري)</label>
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-line bg-cream px-4 py-2 text-sm font-bold text-ink hover:bg-line/50">
              <input type="file" accept="image/*" onChange={handleImageSelection} className="hidden" />
              رفع صورة
            </label>
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Banner" className="h-16 w-32 rounded-lg object-cover border border-line" />
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-plum px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {loading ? "جاري الحفظ..." : "حفظ البانر"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
        </div>
      </form>

      <div className="rounded-xl border border-line bg-white p-5">
        <h2 className="mb-4 text-xl font-bold">المنتجات المشمولة في العروض ({offerProducts.length})</h2>
        <p className="mb-4 text-sm text-ink/60">هذه هي المنتجات التي قمت بتحديد "سعر بعد الخصم" لها من صفحة المنتجات.</p>
        
        {offerProducts.length === 0 ? (
          <div className="rounded-lg bg-cream p-4 text-center text-sm text-ink/60">
            لا توجد منتجات عليها عروض حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {offerProducts.map(p => (
              <div key={p.id} className="flex justify-between items-center rounded-lg border border-line p-3">
                <span className="font-bold text-sm truncate">{p.name}</span>
                <div className="flex flex-col text-left">
                  <span className="text-plum font-bold text-sm">{p.discountPrice} ج.م</span>
                  <span className="text-xs line-through text-ink/40">{p.price} ج.م</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
