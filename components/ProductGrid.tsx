"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/store";
import { toggleFavorite } from "@/lib/actions";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { useDictionary } from "@/components/DictionaryProvider";

export type GridProduct = {
  id: string;
  name: string;
  nameEn?: string | null;
  price: number;
  discountPrice?: number | null;
  audience: "GIRLS" | "BOYS" | "UNISEX";
  imageUrl?: string | null;
  images?: string[];
  emoji?: string | null;
};

const CARD_BG: Record<GridProduct["audience"], string> = {
  GIRLS: "bg-gradient-to-br from-girls/20 to-pink-50/50",
  BOYS: "bg-gradient-to-br from-boys/20 to-sky-50/50",
  UNISEX: "bg-gradient-to-br from-border/50 to-white",
};

const BUTTON_BG: Record<GridProduct["audience"], string> = {
  GIRLS: "bg-girls text-white hover:bg-pink-600",
  BOYS: "bg-boys text-white hover:bg-sky-600",
  UNISEX: "bg-ink text-white hover:bg-neutral",
};

export default function ProductGrid({ products, selectedCategory, selectedAudience, hideAudienceTabs = false }: { products: GridProduct[]; selectedCategory?: string | null; selectedAudience?: "all" | GridProduct["audience"] | null; hideAudienceTabs?: boolean; }) {
  const { dict, lang } = useDictionary();
  const [active, setActive] = useState<"all" | GridProduct["audience"]>("all");
  const addItem = useCart((s) => s.addItem);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const FILTERS: { id: "all" | GridProduct["audience"]; label: string }[] = [
    { id: "all", label: dict.common.all },
    { id: "GIRLS", label: dict.nav.girls },
    { id: "BOYS", label: dict.nav.boys },
    { id: "UNISEX", label: dict.nav.unisex },
  ];
  
  const BADGE_LABEL: Record<GridProduct["audience"], string> = {
    GIRLS: dict.nav.girls,
    BOYS: dict.nav.boys,
    UNISEX: dict.nav.unisex,
  };

  useEffect(() => {
    if (selectedAudience && (selectedAudience === "GIRLS" || selectedAudience === "BOYS" || selectedAudience === "UNISEX" || selectedAudience === "all")) {
      setActive(selectedAudience);
    }
  }, [selectedAudience]);

  const audienceFiltered = selectedAudience && selectedAudience !== "all"
    ? products.filter((p) => p.audience === selectedAudience)
    : products;

  const visibleAudience = hideAudienceTabs
    ? audienceFiltered
    : active === "all"
      ? products
      : products.filter((p) => p.audience === active);

  const visible = selectedCategory
    ? visibleAudience.filter((p) => (p as any).categoryId === selectedCategory)
    : visibleAudience;

  const sectionTitle = hideAudienceTabs
    ? selectedAudience === "GIRLS"
      ? dict.products.bestSellersGirls
      : selectedAudience === "BOYS"
        ? dict.products.bestSellersBoys
        : dict.products.bestSellers
    : dict.products.bestSellers;

  const featuredProducts = visible.slice(0, 4);
  const regularProducts = visible.slice(4);

  return (
    <section className="mx-auto max-w-[1180px] px-3 md:px-8 pb-10 md:pb-20">
      {!hideAudienceTabs && (
        <div className="mb-6 md:mb-8 flex gap-2.5 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              className={`flex-shrink-0 rounded-full border px-5 py-2 text-sm font-bold ${
                active === f.id
                  ? "border-ink bg-ink text-white shadow-md"
                  : "border-border bg-white text-ink hover:bg-background"
              } transition-all duration-200`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-white/50 py-16 text-center">
          <div className="mb-4 text-5xl opacity-30">🔍</div>
          <h3 className="mb-2 font-display text-2xl text-ink">لا توجد منتجات</h3>
          <p className="max-w-xs text-sm text-ink-light">لم نتمكن من العثور على منتجات مطابقة في هذا القسم حالياً.</p>
        </div>
      ) : (
      <>
        <div className="mb-10">
        <div className="mb-7 flex items-end justify-between">
          <h2 className="font-display text-3xl text-ink">{sectionTitle}</h2>
          <p className="text-sm text-ink/55">{featuredProducts.length} {dict.common.products}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {featuredProducts.map((p) => (
            <article
              key={p.id}
              className="group overflow-hidden rounded-xl md:rounded-[24px] border border-border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`relative flex aspect-square w-full items-center justify-center overflow-hidden ${CARD_BG[p.audience]}`}>
                <Link href={`/product/${p.id}`} className="flex h-full w-full items-center justify-center">
                  {p.images && p.images.length > 0 ? (
                    <img
                     src={p.images[0]}
                      alt={lang === "en" ? p.nameEn || p.name : p.name}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 mix-blend-multiply"
                    />
                  ) : p.imageUrl ? (
                   <img
                     src={p.imageUrl}
                     alt={lang === "en" ? p.nameEn || p.name : p.name}
                     className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 mix-blend-multiply"
                   />
                  ) : (
                    <div className="text-[4.5rem] drop-shadow-sm transition-transform duration-200 group-hover:scale-105">
                      {p.emoji}
                    </div>
                  )}
                </Link>

                <div className="absolute right-3 top-3 flex flex-col gap-1 items-end">
                  {p.discountPrice && (
                    <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                      {dict.common.specialOffer}
                    </span>
                  )}
                  <span className={`rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur-sm border ${
                    p.audience === "GIRLS" ? "text-girls border-girls/30" : 
                    p.audience === "BOYS" ? "text-boys border-boys/30" : 
                    "text-ink border-border"
                  }`}>
                    {BADGE_LABEL[p.audience]}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="أعجبني"
                  onClick={async () => {
                    const result = await toggleFavorite(p.id);
                    if (result.ok) {
                      setLiked((s) => ({ ...s, [p.id]: result.liked }));
                    }
                  }}
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[13px] shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <FiHeart className={liked[p.id] ? "text-red-500" : "text-ink/30"} fill={liked[p.id] ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="px-2 pb-3 pt-2 md:px-4 md:pb-4 md:pt-4">
                <Link href={`/${lang}/product/${p.id}`} className="block">
                  <div className="mb-1.5 text-[12px] md:text-[15px] font-bold leading-tight md:leading-6 text-ink line-clamp-2 min-h-[32px] md:min-h-[48px]">{lang === "en" ? p.nameEn || p.name : p.name}</div>
                </Link>
                <div className="flex items-center justify-between gap-1 md:gap-2">
                  <div className="flex flex-col">
                    {p.discountPrice ? (
                      <>
                        <span className="text-[14px] md:text-[18px] font-black text-ink leading-none">{p.discountPrice} {dict.common.egp}</span>
                        <span className="text-[10px] md:text-[12px] line-through text-ink/40 font-bold leading-none mt-0.5">{p.price} {dict.common.egp}</span>
                      </>
                    ) : (
                      <span className="text-[14px] md:text-[18px] font-black text-ink leading-none">{p.price} {dict.common.egp}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="أضف إلى السلة"
                    onClick={() =>
                      addItem({
                        id: p.id,
                        name: lang === "en" ? p.nameEn || p.name : p.name,
                        price: p.discountPrice ?? p.price,
                        emoji: p.emoji ?? null,
                      })
                    }
                    className={`flex h-8 w-8 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-105 ${BUTTON_BG[p.audience]}`}
                  >
                    <FiShoppingBag className="text-[14px] md:text-[16px]" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {regularProducts.length > 0 && (
        <div>
          <div className="mb-7 flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">{dict.products.otherProducts}</h2>
            <p className="text-sm text-ink/55">{regularProducts.length} {dict.common.products}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {regularProducts.map((p) => (
              <article
                key={p.id}
                className="group overflow-hidden rounded-xl md:rounded-[24px] border border-border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`relative flex aspect-square w-full items-center justify-center overflow-hidden ${CARD_BG[p.audience]}`}>
                  <Link href={`/product/${p.id}`} className="flex h-full w-full items-center justify-center">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={lang === "en" ? p.nameEn || p.name : p.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 mix-blend-multiply"
                      />
                    ) : (
                      <div className="text-[4.5rem] drop-shadow-sm transition-transform duration-200 group-hover:scale-105">
                        {p.emoji}
                      </div>
                    )}
                  </Link>

                  <div className="absolute right-3 top-3 flex flex-col gap-1 items-end">
                    {p.discountPrice && (
                      <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                        {dict.common.specialOffer}
                      </span>
                    )}
                    <span className={`rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur-sm border ${
                      p.audience === "GIRLS" ? "text-girls border-girls/30" : 
                      p.audience === "BOYS" ? "text-boys border-boys/30" : 
                      "text-ink border-border"
                    }`}>
                      {BADGE_LABEL[p.audience]}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label="أعجبني"
                    onClick={async () => {
                      const result = await toggleFavorite(p.id);
                      if (result.ok) {
                        setLiked((s) => ({ ...s, [p.id]: result.liked }));
                      }
                    }}
                    className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[13px] shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
                  >
                    <FiHeart className={liked[p.id] ? "text-red-500" : "text-ink/30"} fill={liked[p.id] ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="px-2 pb-3 pt-2 md:px-4 md:pb-4 md:pt-4">
                  <Link href={`/${lang}/product/${p.id}`} className="block">
                    <div className="mb-1.5 text-[12px] md:text-[15px] font-bold leading-tight md:leading-6 text-ink line-clamp-2 min-h-[32px] md:min-h-[48px]">{lang === "en" ? p.nameEn || p.name : p.name}</div>
                  </Link>
                  <div className="flex items-center justify-between gap-1 md:gap-2">
                    <div className="flex flex-col">
                      {p.discountPrice ? (
                        <>
                          <span className="text-[14px] md:text-[18px] font-black text-ink leading-none">{p.discountPrice} {dict.common.egp}</span>
                          <span className="text-[10px] md:text-[12px] line-through text-ink/40 font-bold leading-none mt-0.5">{p.price} {dict.common.egp}</span>
                        </>
                      ) : (
                        <span className="text-base font-black text-ink leading-none">{p.price} {dict.common.egp}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label="أضف إلى السلة"
                      onClick={() =>
                        addItem({
                          id: p.id,
                          name: lang === "en" ? p.nameEn || p.name : p.name,
                          price: p.discountPrice ?? p.price,
                          emoji: p.emoji ?? null,
                        })
                      }
                      className={`flex h-7 w-7 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-105 ${BUTTON_BG[p.audience]}`}
                    >
                      <FiShoppingBag className="text-[12px] md:text-[16px]" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
      </>
      )}
    </section>
  );
}
