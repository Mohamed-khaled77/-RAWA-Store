import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";
import Link from "next/link";
import Pagination from "@/components/Pagination";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const query = q?.trim() || "";

  if (!query) {
    return (
      <main className="mx-auto max-w-[1180px] px-8 py-16 text-center">
        <h1 className="mb-4 font-display text-3xl text-ink">البحث</h1>
        <p className="text-sm text-ink/60">اكتب كلمة للبحث عن المنتجات.</p>
      </main>
    );
  }

  const currentPage = Number(page) || 1;
  const take = 12;
  const skip = (currentPage - 1) * take;
  const where = {
    OR: [
      { name: { contains: query } },
      { description: { contains: query } },
    ],
  };

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalProducts / take);

  const gridProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    audience: p.audience,
    imageUrl: p.imageUrl,
    images: p.images && p.images.length > 0 ? p.images : p.imageUrl ? [p.imageUrl] : [],
    emoji: p.category?.emoji ?? "★",
    categoryId: p.categoryId,
  }));

  return (
    <main className="py-10">
      <div className="mx-auto max-w-[1180px] px-8 mb-8">
        <h1 className="font-display text-3xl text-ink">
          نتائج البحث عن: <span className="text-plum">&quot;{query}&quot;</span>
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          لقينا {products.length} منتج
        </p>
      </div>

      {products.length > 0 ? (
        <>
          <ProductGrid products={gridProducts} hideAudienceTabs />
          <Pagination totalPages={totalPages} />
        </>
      ) : (
        <div className="mx-auto max-w-[1180px] px-8 text-center py-20">
          <p className="mb-6 text-sm text-ink/60">مفيش منتجات بالاسم ده.</p>
          <Link
            href="/"
            className="rounded-xl bg-plum px-6 py-3 text-sm font-bold text-white"
          >
            ارجع للمتجر
          </Link>
        </div>
      )}
    </main>
  );
}
