import { prisma } from "@/lib/prisma";
import HomeInteractive from "@/components/HomeInteractive";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const take = 12;
  const skip = (currentPage - 1) * take;

  const [categories, products, totalProducts, offerBanner] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany({ 
      include: { category: true },
      skip,
      take,
      orderBy: { createdAt: "desc" }
    }),
    prisma.product.count(),
    prisma.offerBanner.findFirst({ where: { isActive: true } })
  ]);

  const totalPages = Math.ceil(totalProducts / take);

  const gridProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    nameEn: p.nameEn,
    price: p.price,
    audience: p.audience,
    imageUrl: p.imageUrl,
    images: p.images && p.images.length > 0 ? p.images : p.imageUrl ? [p.imageUrl] : [],
    discountPrice: p.discountPrice,
    emoji: p.category?.emoji ?? "★",
    categoryId: p.categoryId,
  }));

  return <HomeInteractive categories={categories} products={gridProducts} showHero={true} totalPages={totalPages} offerBanner={offerBanner} />;
}
