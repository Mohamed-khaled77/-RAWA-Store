import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/DashboardStats";

export default async function DashboardOverview() {
  const [orderCount, revenue, lowStockCount, userCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
    prisma.customer.count(),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">نظرة عامة</h1>
      
      <DashboardStats 
        stats={{
          totalRevenue: revenue._sum.total ?? 0,
          totalOrders: orderCount,
          totalUsers: userCount,
          lowStockCount,
        }}
      />
    </div>
  );
}
