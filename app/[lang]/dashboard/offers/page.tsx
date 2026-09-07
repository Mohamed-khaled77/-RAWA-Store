import { prisma } from "@/lib/prisma";
import OfferBannerAdmin from "@/components/OfferBannerAdmin";

export default async function OffersDashboardPage() {
  const [banner, offerProducts] = await Promise.all([
    prisma.offerBanner.findFirst(),
    prisma.product.findMany({
      where: { discountPrice: { not: null } },
      select: { id: true, name: true, price: true, discountPrice: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return <OfferBannerAdmin banner={banner} offerProducts={offerProducts} />;
}
