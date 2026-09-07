"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryRail from "@/components/CategoryRail";
import ProductGrid from "@/components/ProductGrid";
import SplitBanner from "@/components/SplitBanner";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import OfferBannerUI from "@/components/OfferBannerUI";
import { useDictionary } from "@/components/DictionaryProvider";

const AUDIENCE_META: Record<
  "all" | "GIRLS" | "BOYS" | "UNISEX",
  {
    label: string;
    title: string;
    subtitle: string;
    accent: string;
    ring: string;
    badge: string;
    bg: string;
  }
> = {
  all: {
    label: "الكل",
    title: "تجربة شراء متكاملة",
    subtitle: "كل المنتجات المختارة بعناية من كل الأقسام",
    accent: "text-plum",
    ring: "ring-plum/20",
    badge: "bg-plum text-white",
    bg: "from-cream via-white to-[#f6e9ef]",
  },
  GIRLS: {
    label: "بنات",
    title: "منتجات بنات بتفاصيل أنثوية",
    subtitle: "اكسسوارات، مظهر لطيف، وألوان ناعمة تناسب أسلوبك",
    accent: "text-pink-600",
    ring: "ring-pink-200",
    badge: "bg-pink-500 text-white",
    bg: "from-pink-50 via-white to-rose-50",
  },
  BOYS: {
    label: "ولاد",
    title: "منتجات أولاد بأسلوب عصري",
    subtitle: "قطع عملية ومميزة تناسب الستايل اليومي والذوق الراقي",
    accent: "text-sky-600",
    ring: "ring-sky-200",
    badge: "bg-sky-500 text-white",
    bg: "from-sky-50 via-white to-cyan-50",
  },
  UNISEX: {
    label: "مشترك",
    title: "منتجات مشتركة تناسب الجميع",
    subtitle: "أصناف متوازنة تجمع بين الإتقان والسهولة في الارتداء",
    accent: "text-amber-700",
    ring: "ring-amber-200",
    badge: "bg-amber-500 text-white",
    bg: "from-yellow-50 via-white to-orange-50",
  },
};

export default function HomeInteractive({
  categories,
  products,
  selectedAudience = "all",
  showHero = true,
  totalPages,
  offerBanner,
}: {
  categories: any[];
  products: any[];
  selectedAudience?: "all" | "GIRLS" | "BOYS" | "UNISEX";
  showHero?: boolean;
  totalPages?: number;
  offerBanner?: any | null;
}) {
  const { dict, lang } = useDictionary();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const theme = AUDIENCE_META[selectedAudience];

  const audienceCategories =
    selectedAudience === "GIRLS"
      ? categories.filter((cat) => ["ميك أب", "إكسسوارات شعر", "مجوهرات", "محافظ", "نظارات وعطور"].includes(cat.name))
      : selectedAudience === "BOYS"
        ? categories.filter((cat) => ["كابات وقبعات", "محافظ", "نظارات وعطور", "إكسسوارات شعر"].includes(cat.name))
        : categories;

  return (
    <main>
      <Header />
      {showHero && <Hero />}
      {showHero && offerBanner && <OfferBannerUI banner={offerBanner} />}

      {!showHero && (
        <div className="mx-auto max-w-[1180px] px-8 pb-4 pt-8 overflow-hidden">
          <div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${
                selectedCategory === null ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"
              }`}
            >
              {dict.common.all}
            </button>
            {audienceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))}
                className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${
                  selectedCategory === cat.id
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink"
                }`}
              >
                {lang === "en" ? cat.nameEn || cat.name : cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <ProductGrid
        products={products}
        selectedCategory={selectedCategory}
        selectedAudience={selectedAudience}
        hideAudienceTabs={!showHero}
      />

      {totalPages && totalPages > 1 && (
        <Pagination totalPages={totalPages} />
      )}

      {showHero ? <>
        <SplitBanner />
        <Footer />
      </> : <Footer />}
    </main>
  );
}
