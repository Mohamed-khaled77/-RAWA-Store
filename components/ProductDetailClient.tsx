"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiArrowLeft, FiHeart, FiShoppingBag, FiStar } from "react-icons/fi";
import { createProductReview, toggleFavorite } from "@/lib/actions";
import { useCart } from "@/lib/store";
import { useDictionary } from "@/components/DictionaryProvider";

export type ProductDetailItem = {
  id: string;
  name: string;
  nameEn?: string | null;
  price: number;
  description?: string;
  descriptionEn?: string | null;
  audience: "GIRLS" | "BOYS" | "UNISEX";
  categoryName: string;
  categoryNameEn?: string | null;
  imageUrl?: string | null;
  images?: string[];
  emoji?: string | null;
};

export type ProductReviewItem = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const CARD_BG: Record<ProductDetailItem["audience"], string> = {
  GIRLS: "bg-gradient-to-br from-girls/20 to-pink-50/50",
  BOYS: "bg-gradient-to-br from-boys/20 to-sky-50/50",
  UNISEX: "bg-gradient-to-br from-border/50 to-white",
};

const BUTTON_BG: Record<ProductDetailItem["audience"], string> = {
  GIRLS: "bg-girls text-white hover:bg-pink-600",
  BOYS: "bg-boys text-white hover:bg-sky-600",
  UNISEX: "bg-ink text-white hover:bg-neutral",
};

const TEXT_COLOR: Record<ProductDetailItem["audience"], string> = {
  GIRLS: "text-girls",
  BOYS: "text-boys",
  UNISEX: "text-ink",
};

export default function ProductDetailClient({
  product,
  reviews = [],
}: {
  product: ProductDetailItem;
  reviews?: ProductReviewItem[];
}) {
  const { dict, lang } = useDictionary();
  const addItem = useCart((state) => state.addItem);
  const router = useRouter();
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const AUDIENCE_LABEL: Record<ProductDetailItem["audience"], string> = {
    GIRLS: dict.nav.girls,
    BOYS: dict.nav.boys,
    UNISEX: dict.nav.unisex,
  };

  const gallery = product.images && product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const activeImage = gallery[activeImageIndex] ?? null;
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const handleSubmitReview = async () => {
    if (!session?.user) {
      setError(dict.products.loginToReviewError);
      return;
    }

    const trimmed = comment.trim();
    if (!trimmed) {
      setError(dict.products.emptyReviewError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const result = await createProductReview({ productId: product.id, rating, comment: trimmed });
      if (result?.error) {
        setError(result.error);
        return;
      }

      setSuccess(dict.products.reviewSuccess);
      setComment("");
      setRating(5);
      router.refresh();
    } catch {
      setError(dict.products.reviewError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1180px] px-4 md:px-8 py-6 md:py-10 pb-28 md:pb-10">
      <Link
        href={`/${lang}`}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-cream"
      >
        <FiArrowLeft />
        {dict.products.backToShop}
      </Link>

      <div className="grid gap-6 md:gap-8 rounded-2xl md:rounded-[32px] border border-line bg-white p-5 md:p-10 shadow-[0_14px_30px_rgba(58,41,49,0.06)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className={`relative flex min-h-[320px] md:min-h-[420px] items-center justify-center overflow-hidden rounded-[20px] md:rounded-[28px] ${CARD_BG[product.audience]}`}>
            {activeImage ? (
              <img src={activeImage} alt={lang === "en" ? product.nameEn || product.name : product.name} className="h-full w-full object-cover mix-blend-multiply" />
            ) : (
              <div className="text-[9rem] drop-shadow-sm">{product.emoji}</div>
            )}
            <span className={`absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-sm border ${
              product.audience === "GIRLS" ? "text-girls border-girls/30" : 
              product.audience === "BOYS" ? "text-boys border-boys/30" : 
              "text-ink border-border"
            }`}>
              {AUDIENCE_LABEL[product.audience]}
            </span>
            <button
              type="button"
              aria-label="أعجبني"
              onClick={async () => {
                const result = await toggleFavorite(product.id);
                if (result.ok) {
                  setLiked(result.liked);
                }
              }}
              className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm"
            >
              <FiHeart className={liked ? "text-red-500" : "text-ink/20"} fill={liked ? "currentColor" : "none"} />
            </button>
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="الصورة السابقة"
                  onClick={() => setActiveImageIndex((index) => (index === 0 ? gallery.length - 1 : index - 1))}
                  className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="الصورة التالية"
                  onClick={() => setActiveImageIndex((index) => (index === gallery.length - 1 ? 0 : index + 1))}
                  className="absolute left-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm"
                >
                  →
                </button>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`overflow-hidden rounded-xl border ${activeImageIndex === index ? "border-plum" : "border-line"} bg-white`}
                >
                  <img src={image} alt={`${lang === "en" ? product.nameEn || product.name : product.name} ${index + 1}`} className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center mt-2 md:mt-0">
          <div className="mb-3 inline-flex w-fit rounded-full bg-cream px-3 py-1 text-xs font-bold text-plum">
            {lang === "en" ? product.categoryNameEn || product.categoryName : product.categoryName}
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-ink">{lang === "en" ? product.nameEn || product.name : product.name}</h1>

          <div className="mt-4 md:mt-5 flex items-center gap-3">
            <span className={`text-2xl md:text-3xl font-black ${TEXT_COLOR[product.audience]}`}>{product.price} {dict.common.egp}</span>
            <span className="rounded-full border border-line bg-cream px-2.5 py-1 text-xs font-bold text-ink/70">
              {AUDIENCE_LABEL[product.audience]}
            </span>
          </div>

          <p className="mt-5 md:mt-6 text-[15px] md:text-base leading-7 md:leading-8 text-ink/75">
            {lang === "en" ? product.descriptionEn || product.description : product.description}
          </p>

          {/* Desktop buttons */}
          <div className="mt-8 hidden md:flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addItem({ id: product.id, name: lang === "en" ? product.nameEn || product.name : product.name, price: product.price, emoji: product.emoji ?? null })}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-1 ${BUTTON_BG[product.audience]}`}
            >
              <FiShoppingBag />
              {dict.common.addToCart}
            </button>

            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-bold text-ink transition-colors hover:bg-cream"
            >
              {dict.products.continueShopping}
            </Link>
          </div>

          {/* Mobile Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-white px-6 py-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:hidden">
            <div className="flex flex-col">
              <span className={`text-xl font-black leading-none mb-1 ${TEXT_COLOR[product.audience]}`}>{product.price}</span>
              <span className="text-[11px] font-bold text-ink/60 leading-none">{dict.common.egp}</span>
            </div>
            <button
              type="button"
              onClick={() => addItem({ id: product.id, name: lang === "en" ? product.nameEn || product.name : product.name, price: product.price, emoji: product.emoji ?? null })}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-transform hover:scale-105 ${BUTTON_BG[product.audience]}`}
            >
              <FiShoppingBag />
              {dict.common.addToCart}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-10 rounded-2xl md:rounded-[28px] border border-line bg-white p-5 md:p-6 shadow-[0_12px_28px_rgba(58,41,49,0.04)]">
        <div className="mb-5 md:mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-ink">{dict.products.customerReviews}</h2>
          <div className="flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-sm font-bold text-plum">
            <FiStar className="text-base" fill="currentColor" />
            {reviews.length ? averageRating.toFixed(1) : "0.0"}
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-cream/50 p-4">
            <p className="mb-2 text-sm text-ink/70">{dict.products.addNewReview}</p>
            {session?.user ? (
              <>
                <div className="mb-3 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`تقييم ${value} نجوم`}
                      className={value <= rating ? "text-[#f8b84e]" : "text-slate-300"}
                    >
                      <FiStar className="text-xl" fill="currentColor" />
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={4}
                  placeholder={dict.products.writeReviewPlaceholder}
                  className="w-full rounded-2xl border border-line bg-white p-3 text-sm text-ink outline-none ring-0 placeholder:text-ink/35 focus:border-plum"
                />

                {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
                {success ? <p className="mt-2 text-sm text-green-600">{success}</p> : null}

                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-plum px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? dict.products.submitting : dict.products.submitReview}
                </button>
              </>
            ) : (
              <p className="text-sm text-ink/70">
                {dict.products.loginToReview}{" "}
                <Link href={`/${lang}/login`} className="font-bold text-plum">
                  {dict.common.login}
                </Link>
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="mb-2 text-sm text-ink/70">{dict.products.reviewSummary}</p>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((review) => review.rating === star).length;
                const width = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="grid grid-cols-[42px_1fr_42px] items-center gap-3 text-sm text-ink/70">
                    <span>{star} {dict.products.stars}</span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-cream">
                      <div className="h-full rounded-full bg-[#f8b84e]" style={{ width: `${width}%` }} />
                    </div>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {reviews.length ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-line bg-cream/30 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-ink">{review.customerName}</p>
                    <p className="text-xs text-ink/60">{new Date(review.createdAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#f8b84e]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} className={star <= review.rating ? "text-gold" : "text-ink/20"} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="leading-8 text-ink/80">{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-cream/20 p-6 text-center text-ink/60">
            {dict.products.noReviews}
          </div>
        )}
      </div>
    </main>
  );
}
