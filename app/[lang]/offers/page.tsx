import { prisma } from "@/lib/prisma";
import HomeInteractive from "@/components/HomeInteractive";

export default async function OffersPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({ 
      where: { discountPrice: { not: null } },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
  ]);

  const gridProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    audience: p.audience,
    imageUrl: p.imageUrl,
    images: p.images && p.images.length > 0 ? p.images : p.imageUrl ? [p.imageUrl] : [],
    discountPrice: p.discountPrice,
    emoji: p.category?.emoji ?? "★",
    categoryId: p.categoryId,
  }));

  return (
    <>
      <div className="bg-gradient-to-r from-girls to-boys py-10 text-center text-white">
        <h1 className="font-display text-4xl font-bold">العروض الخاصة 🏷️</h1>
        <p className="mt-2 text-sm opacity-90">تسوق أفضل المنتجات بأسعار مخفضة</p>
      </div>
      <HomeInteractive categories={categories} products={gridProducts} showHero={false} />
    </>
  );
}
