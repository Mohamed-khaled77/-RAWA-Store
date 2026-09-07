"use client";

import { useDictionary } from "@/components/DictionaryProvider";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function Hero() {
  const { dict, lang } = useDictionary();

  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? FiArrowLeft : FiArrowRight;

  return (
    <section className="mx-auto max-w-[1180px] px-4 py-6 md:px-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 min-h-[480px]">
        {/* Main Bento Cell */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center rounded-[32px] bg-white p-8 md:p-12 lg:p-16 shadow-2xl shadow-ink/5 border border-border/50 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500 relative overflow-hidden group">
          {/* Subtle Animated Background Blobs */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-girls/20 blur-[100px] transition-transform duration-1000 group-hover:scale-110 pointer-events-none"></div>
          <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-boys/20 blur-[100px] transition-transform duration-1000 group-hover:scale-110 pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-start flex flex-col items-center md:items-start">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/60 backdrop-blur-md px-4 py-1.5 text-[11px] md:mb-6 md:text-[13px] font-bold text-ink shadow-sm">
              <span className="text-girls animate-pulse">●</span> {dict.hero.badge}
            </div>

            <h1 className="mb-4 font-display text-4xl leading-tight text-ink md:mb-6 md:text-5xl lg:text-7xl lg:leading-[1.1]">
              {dict.hero.titlePart1}
              {lang === 'ar' ? (
                <>
                  <br />
                  {dict.hero.titlePart2} <span className="bg-gradient-to-l from-girls to-boys bg-clip-text text-transparent drop-shadow-sm">{dict.hero.titleHighlight}</span>
                </>
              ) : (
                <>
                  {" "}{dict.hero.titlePart2}{" "}
                  <span className="bg-gradient-to-r from-girls to-boys bg-clip-text text-transparent drop-shadow-sm">{dict.hero.titleHighlight}</span>
                </>
              )}
            </h1>

            <p className="mb-8 max-w-lg text-[15px] md:mb-10 md:text-[18px] text-ink-light leading-relaxed mx-auto md:mx-0 font-medium">
              {dict.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 md:gap-4 w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-girls to-boys px-8 py-4 text-[15px] md:text-[16px] font-bold text-white transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(244,114,182,0.6)] hover:-translate-y-1 w-full sm:w-auto">
                {dict.hero.shopNow}
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border/80 bg-white/50 backdrop-blur-sm px-8 py-4 text-[15px] md:text-[16px] font-bold text-ink transition-all duration-300 hover:bg-background hover:border-ink hover:-translate-y-1 w-full sm:w-auto">
                {dict.hero.explore}
              </button>
            </div>
          </div>
        </div>

        {/* Right Images Column (Bento Split) */}
        <div className="md:col-span-5 lg:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
          
          {/* Girls Bento Cell */}
          <Link href={`/${lang}/audience/GIRLS`} className="relative overflow-hidden rounded-[32px] bg-pink-50/50 border border-girls/20 group h-[220px] md:h-auto min-h-[220px] block shadow-xl shadow-girls/10 hover:shadow-2xl hover:shadow-girls/30 transition-all duration-500">
            <img 
              src="/images/hero-girls.png" 
              alt="Girls Fashion" 
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" 
            />
            {/* Gradient Overlay for Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"></div>
            
            <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between">
              <span className="font-display text-white text-2xl drop-shadow-md">
                {lang === 'ar' ? 'بنات' : 'Girls'}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-transform duration-300 group-hover:bg-white group-hover:text-girls group-hover:scale-110">
                <ArrowIcon />
              </span>
            </div>
          </Link>
          
          {/* Boys Bento Cell */}
          <Link href={`/${lang}/audience/BOYS`} className="relative overflow-hidden rounded-[32px] bg-sky-50/50 border border-boys/20 group h-[220px] md:h-auto min-h-[220px] block shadow-xl shadow-boys/10 hover:shadow-2xl hover:shadow-boys/30 transition-all duration-500">
            <img 
              src="/images/hero-boys.png" 
              alt="Boys Fashion" 
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" 
            />
            {/* Gradient Overlay for Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"></div>
            
            <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between">
              <span className="font-display text-white text-2xl drop-shadow-md">
                {lang === 'ar' ? 'ولاد' : 'Boys'}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-transform duration-300 group-hover:bg-white group-hover:text-boys group-hover:scale-110">
                <ArrowIcon />
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
