"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateCustomerProfile } from "@/lib/actions";

export type AccountProfileProps = {
  initialName: string;
  initialAvatarUrl?: string | null;
  phone: string;
  favoriteProducts: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    images?: string[];
  }>;
  numericId: number;
  isVip: boolean;
  lastNameChangedAt?: Date | null;
};

export default function AccountProfileClient({
  initialName,
  initialAvatarUrl,
  phone,
  favoriteProducts,
  numericId,
  isVip,
  lastNameChangedAt,
}: AccountProfileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const safeAvatar = avatarUrl?.trim();
  const daysSinceChange = lastNameChangedAt ? (new Date().getTime() - new Date(lastNameChangedAt).getTime()) / (1000 * 60 * 60 * 24) : null;
  const canChangeName = daysSinceChange === null || daysSinceChange >= 60;
  const daysLeft = daysSinceChange !== null ? Math.ceil(60 - daysSinceChange) : 0;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setLoading(true);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 256;
      const MAX_HEIGHT = 256;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("file", blob, file.name);

        try {
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (res.ok) {
            setAvatarUrl(data.url);
          } else {
            setMessage(data.error || "فشل الرفع");
          }
        } catch (err) {
          setMessage("فشل في الاتصال");
        }
        setLoading(false);
      }, "image/jpeg", 0.7);
      
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      setMessage("فشل في قراءة الصورة");
      setLoading(false);
    };
    img.src = objectUrl;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    const result = await updateCustomerProfile({ name, avatarUrl: avatarUrl || null });
    setLoading(false);

    if (result.ok) {
      setMessage("تم تحديث بياناتك بنجاح");
      router.refresh(); // Refresh page to get latest session data for navbar
      return;
    }

    setMessage(result.error || "حدث خطأ أثناء التحديث");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_14px_30px_rgba(58,41,49,0.06)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-line bg-cream text-3xl font-black text-girls">
              {safeAvatar ? (
                <img src={safeAvatar} alt={name} className="h-full w-full object-cover" />
              ) : (
                name?.charAt(0) ?? "؟"
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="font-display text-3xl text-ink flex flex-wrap items-center gap-3">
              {name}
              {isVip && (
                <span className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-3 py-1 text-xs font-black text-white shadow-sm">VIP</span>
              )}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-ink/60" dir="ltr">
              <span>Client #{numericId}</span>
              <span>&bull;</span>
              <span>{phone}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 flex items-center justify-between text-sm font-bold text-ink">
              <span>الاسم</span>
              {!canChangeName && <span className="text-[11px] text-rose">متبقي {daysLeft} يوم للتعديل</span>}
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!canChangeName}
              className="w-full rounded-2xl border border-line bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-girls disabled:opacity-50"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink">رابط صورة البروفايل</span>
            <input
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-2xl border border-line bg-cream/40 px-4 py-3 text-sm text-ink outline-none focus:border-girls"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-ink"
          >
            اختيار صورة من الجهاز
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-girls to-boys px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60 shadow-md"
          >
            {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>

        {message ? <p className="mt-4 text-sm text-girls">{message}</p> : null}
      </div>

      <div className="rounded-[28px] border border-line bg-white p-6 shadow-[0_14px_30px_rgba(58,41,49,0.06)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">المفضلة</h2>
          <span className="text-sm text-ink/60">{favoriteProducts.length} عنصر</span>
        </div>

        {favoriteProducts.length === 0 ? (
          <p className="text-sm text-ink/60">ما في منتجات مفضلة لحد الآن.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteProducts.map((product) => {
              const productImage = product.images?.[0] ?? product.imageUrl;

              return (
                <Link key={product.id} href={`/product/${product.id}`} className="group overflow-hidden rounded-[20px] border border-line bg-cream/30">
                  <div className="relative h-40 overflow-hidden">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-cream text-4xl">✨</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-sm font-bold text-ink line-clamp-2">{product.name}</h3>
                    <p className="text-base font-black text-girls">{product.price} جنيه</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
