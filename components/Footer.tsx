"use client";

import Link from "next/link";
import { useDictionary } from "@/components/DictionaryProvider";

export default function Footer() {
  const { dict, lang } = useDictionary();

  return (
    <footer className="bg-ink px-8 pb-[30px] pt-12 text-white border-t border-border">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-8 border-b border-white/10 pb-8 md:grid-cols-4">
        <div>
          <div className="mb-2.5 font-display text-3xl font-black text-white">روا</div>
          <p className="max-w-[220px] text-[13px] text-white/60">
            {dict.footer.description}
          </p>
        </div>
        <FootCol 
          title={dict.footer.categories} 
          items={[dict.nav.girls, dict.nav.boys, dict.nav.unisex, dict.nav.offers]} 
          links={{
            [dict.nav.girls]: `/${lang}/audience/GIRLS`,
            [dict.nav.boys]: `/${lang}/audience/BOYS`,
            [dict.nav.unisex]: `/${lang}/audience/UNISEX`,
            [dict.nav.offers]: `/${lang}/offers`,
          }}
        />
        <FootCol
          title={dict.footer.help}
          items={[dict.footer.trackOrder, dict.footer.shipping, dict.footer.contact]}
          links={{ 
            [dict.footer.trackOrder]: `/${lang}/account`,
            [dict.footer.shipping]: `/${lang}/shipping`,
            [dict.footer.contact]: `/${lang}/contact`
          }}
        />
        <FootCol title={dict.footer.followUs} items={["إنستجرام", "تيك توك", "واتساب"]} />
      </div>

      <div className="mx-auto flex flex-col sm:flex-row max-w-[1180px] items-center justify-between gap-2 pt-5 text-xs text-white/50">
        <span>{dict.common.copyright}</span>
        <a 
          href="https://my-portfolio-gilt-seven-82.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-girls underline decoration-girls/50 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
        >
          {dict.common.developedBy}
        </a>
      </div>
    </footer>
  );
}

function FootCol({
  title,
  items,
  links = {},
}: {
  title: string;
  items: string[];
  links?: Record<string, string>;
}) {
  return (
    <div>
      <h4 className="mb-3.5 text-sm text-white/90">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((item) =>
          links[item] ? (
            <li key={item} className="text-[13px]">
              <Link href={links[item]} className="text-white/60 hover:text-white">
                {item}
              </Link>
            </li>
          ) : (
            <li key={item} className="text-[13px] text-white/60">
              {item}
            </li>
          )
        )}
      </ul>
    </div>
  );
}
