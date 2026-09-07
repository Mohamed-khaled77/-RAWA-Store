import { prisma } from "@/lib/prisma";
import CustomerListClient from "@/components/CustomerListClient";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { numericId: "asc" },
    include: {
      orders: {
        select: {
          total: true,
        },
      },
    },
  });

  const formattedCustomers = customers.map(c => ({
    id: c.id,
    numericId: c.numericId,
    name: c.name,
    phone: c.phone,
    isVip: c.isVip,
    totalSpent: c.orders.reduce((acc, o) => acc + o.total, 0),
    orderCount: c.orders.length,
  }));

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">العملاء والـ VIP</h1>
      <CustomerListClient customers={formattedCustomers} />
    </div>
  );
}
