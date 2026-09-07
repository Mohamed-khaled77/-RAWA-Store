import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

// Category emojis are fetched dynamically from the database.

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { lang } = await searchParams;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return { title: "منتج غير موجود" };
  }

  return {
    title: `${lang === "en" ? product.nameEn || product.name : product.name} | ${lang === "en" ? "Rawa Store" : "متجر روا"}`,
    description: lang === "en" ? product.descriptionEn || `Buy ${product.nameEn || product.name} at the best price from Rawa Store.` : product.description || `اشتري ${product.name} بأفضل سعر من متجر روا.`,
    openGraph: {
      title: `${lang === "en" ? product.nameEn || product.name : product.name} | ${lang === "en" ? "Rawa Store" : "متجر روا"}`,
      description: product.description || `تسوق ${product.name} الآن.`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: { customer: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const gallery = product.images && product.images.length > 0 ? product.images : product.imageUrl ? [product.imageUrl] : [];

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        name: product.name,
        nameEn: product.nameEn,
        price: product.price,
        description: product.description ?? "",
        descriptionEn: product.descriptionEn ?? "",
        audience: product.audience,
        categoryName: product.category.name,
        categoryNameEn: product.category.nameEn,
        imageUrl: product.imageUrl ?? null,
        images: gallery,
        emoji: product.category?.emoji ?? "★",
      }}
      reviews={product.reviews.map((review) => ({
        id: review.id,
        customerName: review.customer?.name ?? "مستخدم",
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt.toISOString(),
      }))}
    />
  );
}
