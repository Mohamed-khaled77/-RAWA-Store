import type { Metadata } from "next";
import { Tajawal, Lalezar } from "next/font/google";
import "../globals.css";
import CartDrawer from "@/components/CartDrawer";
import AuthProvider from "@/components/AuthProvider";
import { getDictionary, Locale } from "@/lib/dictionary";
import { DictionaryProvider } from "@/components/DictionaryProvider";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-tajawal",
});

const lalezar = Lalezar({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-lalezar",
});

export const metadata: Metadata = {
  title: {
    template: "%s | متجر روا",
    default: "متجر روا | أحدث الماركات وأفضل الأسعار",
  },
  description: "متجر روا لبيع أحدث وأفضل المنتجات المتنوعة بأسعار مميزة وتوصيل سريع. اكتشف تشكيلتنا الجديدة الآن.",
  keywords: ["متجر", "روا", "منتجات", "ملابس", "إكسسوارات", "تسوق"],
  openGraph: {
    title: "متجر روا",
    description: "أحدث المنتجات بأفضل الأسعار.",
    url: "https://rawastore.com",
    siteName: "متجر روا",
    locale: "ar_EG",
    type: "website",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === "en" ? "en" : "ar") as Locale;
  const dict = await getDictionary(validLang);
  const dir = validLang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={validLang} dir={dir}>
      <body className={`${tajawal.variable} ${lalezar.variable} font-body`}>
        <AuthProvider>
          <DictionaryProvider dict={dict} lang={validLang}>
            {children}
            <CartDrawer />
          </DictionaryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
