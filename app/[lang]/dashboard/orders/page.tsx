import { prisma } from "@/lib/prisma";
import OrdersAdmin from "@/components/OrdersAdmin";

export default async function DashboardOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, customer: true },
  });

  return <OrdersAdmin orders={orders} />;
}
