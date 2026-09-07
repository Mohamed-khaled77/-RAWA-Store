import HomeInteractive from "@/components/HomeInteractive";
import { prisma } from "@/lib/prisma";

const CATEGORY_EMOJI: Record<string, string> = {
  "ميك أب": "💄",
  "إكسسوارات شعر": "🎁",
  مجوهرات: "💎",
  "كابات وقبعات": "🧢",
  محافظ: "👛",
  "نظارات وعطور": "🕶️",
};

export default async function AudiencePage({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;
  const normalizedAudience: "all" | "GIRLS" | "BOYS" | "UNISEX" =
    audience?.toUpperCase() === "GIRLS" || audience?.toUpperCase() === "BOYS" || audience?.toUpperCase() === "UNISEX"
      ? (audience.toUpperCase() as "GIRLS" | "BOYS" | "UNISEX")
      : "all";

  const [categories, products] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({ include: { category: true } }),
  ]);

  const gridProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    audience: p.audience,
    imageUrl: p.imageUrl,
    images: p.images && p.images.length > 0 ? p.images : p.imageUrl ? [p.imageUrl] : [],
    emoji: CATEGORY_EMOJI[p.category.name] ?? "★",
    categoryId: p.categoryId,
  }));

  return <HomeInteractive categories={categories} products={gridProducts} selectedAudience={normalizedAudience} showHero={false} />;
}
