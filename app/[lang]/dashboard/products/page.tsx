import { prisma } from "@/lib/prisma";
import ProductsAdmin from "@/components/ProductsAdmin";

export default async function DashboardProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  return <ProductsAdmin products={products} categories={categories} />;
}
