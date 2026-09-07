"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/store";
import { FiSearch, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useDictionary } from "@/components/DictionaryProvider";

export default function Header() {
  const { dict, lang } = useDictionary();
  
  const links = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.girls, href: `/${lang}/audience/GIRLS` },
    { label: dict.nav.boys, href: `/${lang}/audience/BOYS` },
    { label: dict.nav.offers, href: `/${lang}/offers` },
  ];
  const { items, openCart } = useCart();
  const { data: session } = useSession();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const pathname = usePathname();
  const router = useRouter();
  // Ensure we strip the locale for pathAudience checking
  const pathParts = pathname?.split("/") || [];
  const pathAudience = pathParts.length > 3 && pathParts[2] === "audience" ? pathParts[3]?.toUpperCase() : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${lang}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="القائمة"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:text-plum"
          >
            <FiMenu />
          </button>
        </div>

        <div className="flex items-baseline gap-1.5 font-display text-2xl md:text-3xl text-ink">
          روا
          <span className="font-body text-[10px] md:text-[11px] font-medium text-ink-light tracking-widest uppercase">
            RAWA
          </span>
        </div>

        <ul className="hidden gap-8 text-[15px] font-medium md:flex">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== `/${lang}` && pathname.startsWith(link.href));

            return (
              <li key={link.label} className="relative py-1">
                <Link href={link.href} className={`transition-colors hover:text-ink ${active ? "text-ink font-bold" : "text-ink-light"}`}>
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-0.5 right-0 left-0 h-0.5 rounded bg-ink" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className={`transition-all duration-300 ease-in-out z-50 ${searchOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 md:translate-y-0 w-0'} absolute top-full left-0 right-0 bg-white p-4 border-b border-border shadow-md md:static md:p-0 md:bg-transparent md:border-0 md:shadow-none md:w-56 md:ml-2`}>
              <input
                type="text"
                placeholder={dict.common.searchPlaceholder || "ابحث هنا..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 md:py-1.5 text-sm outline-none focus:border-ink transition-colors"
              />
            </div>
            <button
              type={searchOpen ? "submit" : "button"}
              onClick={() => {
                if (!searchOpen) setSearchOpen(true);
              }}
              aria-label="بحث"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:bg-background"
            >
              <FiSearch />
            </button>
          </form>
            {session?.user ? (
              <div className="hidden items-center gap-2 md:flex">
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/dashboard"
                    className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-bold"
                  >
                    الداش بورد
                  </Link>
                )}
                <Link
                  href="/account"
                  aria-label="حسابي"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-sm font-bold"
                >
                  {session.user.name?.charAt(0) ?? "؟"}
                </Link>
              </div>
            ) : (
              <Link
                href={`/${lang}/login`}
                className="hidden rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-bold md:block"
              >
                {dict.common.login}
              </Link>
            )}
            
              <button
              onClick={() => {
                const newLang = lang === "ar" ? "en" : "ar";
                const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
                router.push(newPath || `/${newLang}`);
              }}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-sm font-bold uppercase transition-colors hover:bg-background md:flex"
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>

          <button
            onClick={openCart}
            aria-label={dict.common.cart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-background"
          >
            <FiShoppingBag />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-surface shadow-2xl flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="font-display text-2xl text-ink">روا</div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-ink"
              >
                <FiX />
              </button>
            </div>
            
            <ul className="flex flex-col gap-6 text-[16px] font-bold">
              {links.map((link) => {
                const active = pathname === link.href || (link.href !== `/${lang}` && pathname.startsWith(link.href));

                return (
                  <li key={link.label}>
                    <Link href={link.href} className={active ? "text-ink font-bold" : "text-ink-light"} onClick={() => setMobileMenuOpen(false)}>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto pt-6 border-t border-line flex flex-col gap-4">
              {/* Language Switcher for Mobile */}
              <button
                onClick={() => {
                  const newLang = lang === "ar" ? "en" : "ar";
                  const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
                  router.push(newPath || `/${newLang}`);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-line bg-cream px-4 py-3 text-sm font-bold text-ink"
              >
                <span>{lang === "ar" ? "Language" : "اللغة"}</span>
                <span>{lang === "ar" ? "English" : "عربي"}</span>
              </button>

              {/* Account for Mobile */}
              {session?.user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-xl border border-line bg-white px-4 py-3 text-center text-sm font-bold text-ink truncate"
                  >
                    حسابي ({session.user.name})
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href={`/${lang}/dashboard`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full rounded-xl bg-ink py-3 text-center text-sm font-bold text-white"
                    >
                      الداش بورد
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  href={`/${lang}/login`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-xl bg-gradient-to-r from-girls to-boys py-3 text-center text-sm font-bold text-white"
                >
                  {dict.common.login}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
