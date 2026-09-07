"use client";

import Link from "next/link";
import { useDictionary } from "@/components/DictionaryProvider";

type BannerProps = {
  banner: {
    title: string;
    titleEn?: string | null;
    subtitle: string | null;
    subtitleEn?: string | null;
    buttonText: string | null;
    buttonTextEn?: string | null;
    imageUrl: string | null;
  };
};

export default function OfferBannerUI({ banner }: BannerProps) {
  const { lang, dict } = useDictionary();

  return (
    <div className="mx-auto max-w-[1180px] px-8 py-6">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-girls to-boys shadow-lg">
        {/* Background Image if available */}
        {banner.imageUrl && (
          <img 
            src={banner.imageUrl} 
            alt="Banner background" 
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        
        <div className="relative z-10 flex flex-col items-center justify-center p-10 text-center text-white sm:p-14">
          <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            {dict.common.specialOffer}
          </span>
          <h2 className="mb-3 font-display text-4xl sm:text-5xl">{lang === "en" ? banner.titleEn || banner.title : banner.title}</h2>
          {(lang === "en" ? banner.subtitleEn || banner.subtitle : banner.subtitle) && (
            <p className="mb-6 max-w-xl text-sm sm:text-base opacity-90">{lang === "en" ? banner.subtitleEn || banner.subtitle : banner.subtitle}</p>
          )}
          <Link
            href={`/${lang}/offers`}
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-ink shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {lang === "en" ? banner.buttonTextEn || banner.buttonText || "Shop Offers" : banner.buttonText || "تسوق العروض"}
          </Link>
        </div>
      </div>
    </div>
  );
}

