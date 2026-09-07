"use client";

import { useState } from "react";
import { updateReturnRequestStatus } from "@/lib/admin-actions";

type ReturnRequest = {
  id: string;
  orderId: string;
  reason: string;
  status: string;
  createdAt: Date;
  customerName: string;
  customerPhone: string;
  orderTotal: number;
  items: { name: string; quantity: number }[];
};

const STATUS_ARABIC: Record<string, string> = {
  pending: "قيد المراجعة",
  approved: "تمت الموافقة (قيد الاستلام)",
  completed: "تم الاسترجاع",
  rejected: "مرفوض",
};

export default function ReturnsListClient({ requests: initialRequests }: { requests: ReturnRequest[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const res = await updateReturnRequestStatus(id, newStatus);
    setLoadingId(null);
    if (res.ok) {
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-6">
      {requests.map(req => (
        <div key={req.id} className="rounded-[24px] border border-line bg-white p-6 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-ink/60 mb-1" dir="ltr">{new Date(req.createdAt).toLocaleString("ar-EG")}</p>
                <p className="font-bold text-ink text-lg">طلب #{req.orderId.slice(0, 8)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                req.status === 'completed' ? 'bg-green-100 text-green-800' :
                req.status === 'rejected' ? 'bg-rose-light text-rose' :
                'bg-cream text-ink'
              }`}>
                {STATUS_ARABIC[req.status] || req.status}
              </span>
            </div>

            <div className="mb-4 text-sm text-ink/80">
              <p><strong>العميل:</strong> {req.customerName} ({req.customerPhone})</p>
              <p className="mt-1"><strong>قيمة الطلب الأصلي:</strong> {req.orderTotal} EGP</p>
              <p className="mt-1"><strong>المنتجات:</strong> {req.items.map(i => `${i.name} (x${i.quantity})`).join('، ')}</p>
            </div>

            <div className="rounded-xl bg-cream/40 p-4 border border-line">
              <p className="text-sm font-bold text-ink mb-1">سبب الاسترجاع:</p>
              <p className="text-sm text-ink/70">{req.reason}</p>
            </div>
          </div>
          
          <div className="flex w-full flex-col gap-2 md:w-48 justify-center border-t border-line md:border-t-0 md:border-r pt-4 md:pt-0 md:pr-6">
            <h3 className="mb-2 text-sm font-bold text-ink text-center">تغيير الحالة</h3>
            <select
              value={req.status}
              onChange={(e) => handleStatusChange(req.id, e.target.value)}
              disabled={loadingId === req.id}
              className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-plum disabled:opacity-50"
            >
              <option value="pending">قيد المراجعة</option>
              <option value="approved">موافق عليه</option>
              <option value="completed">تم الاسترجاع</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>
      ))}

      {requests.length === 0 && (
        <div className="rounded-[24px] border border-line bg-white p-12 text-center text-ink/50">
          لا توجد طلبات استرجاع حالياً
        </div>
      )}
    </div>
  );
}
