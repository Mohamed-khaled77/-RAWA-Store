import { prisma } from "@/lib/prisma";
import ReturnsListClient from "@/components/ReturnsListClient";

export default async function ReturnsPage() {
  const returnRequests = await prisma.returnRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: {
          customer: { select: { name: true, phone: true } },
          items: { include: { product: { select: { name: true } } } }
        }
      }
    }
  });

  const formattedRequests = returnRequests.map(r => ({
    id: r.id,
    orderId: r.orderId,
    reason: r.reason,
    status: r.status,
    createdAt: r.createdAt,
    customerName: r.order.customer.name,
    customerPhone: r.order.customer.phone,
    orderTotal: r.order.total,
    items: r.order.items.map(i => ({ name: i.product.name, quantity: i.quantity }))
  }));

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">طلبات الاسترجاع</h1>
      <ReturnsListClient requests={formattedRequests} />
    </div>
  );
}
