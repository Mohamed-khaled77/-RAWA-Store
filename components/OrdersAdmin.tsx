"use client";

import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions";

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  customer: { name: string; phone: string; address: string | null };
  items: { id: string; quantity: number; price: number }[];
};

const STATUSES = ["pending", "paid", "shipped", "delivered"];
const STATUS_LABEL: Record<string, string> = {
  pending: "قيد التجهيز",
  paid: "تم الدفع",
  shipped: "في الطريق",
  delivered: "تم التوصيل",
};

export default function OrdersAdmin({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function handleStatusChange(orderId: string, status: string) {
    await updateOrderStatus(orderId, status);
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">الطلبات</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-ink/50">لسه مفيش أي طلبات.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-xl border border-line bg-white p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold">{order.customer.name}</div>
                  <div className="text-xs text-ink/50">
                    {order.customer.phone} · {order.customer.address}
                  </div>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="mb-3 space-y-1">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>منتج × {item.quantity}</span>
                    <span>{item.price * item.quantity} جنيه</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-line pt-3 text-sm font-bold">
                <span>{new Date(order.createdAt).toLocaleDateString("ar-EG")}</span>
                <span className="text-plum">{order.total} جنيه</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
