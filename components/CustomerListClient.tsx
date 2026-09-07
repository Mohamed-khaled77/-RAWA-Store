"use client";

import { useState } from "react";
import { toggleVipStatus } from "@/lib/admin-actions";

type CustomerInfo = {
  id: string;
  numericId: number;
  name: string;
  phone: string;
  isVip: boolean;
  totalSpent: number;
  orderCount: number;
};

export default function CustomerListClient({ customers: initialCustomers }: { customers: CustomerInfo[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleVip = async (id: string, currentVip: boolean) => {
    setLoadingId(id);
    const res = await toggleVipStatus(id, !currentVip);
    setLoadingId(null);
    if (res.ok) {
      setCustomers(customers.map(c => c.id === id ? { ...c, isVip: !currentVip } : c));
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-line bg-white shadow-sm">
      <table className="w-full text-sm text-ink">
        <thead className="bg-cream text-right">
          <tr>
            <th className="px-6 py-4 font-bold">ID</th>
            <th className="px-6 py-4 font-bold">الاسم</th>
            <th className="px-6 py-4 font-bold">الموبايل</th>
            <th className="px-6 py-4 font-bold text-center">الطلبات</th>
            <th className="px-6 py-4 font-bold text-center">إجمالي الدفع</th>
            <th className="px-6 py-4 font-bold text-center">VIP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="px-6 py-4 font-bold" dir="ltr">#{c.numericId}</td>
              <td className="px-6 py-4 font-bold">{c.name}</td>
              <td className="px-6 py-4" dir="ltr">{c.phone}</td>
              <td className="px-6 py-4 text-center font-bold">{c.orderCount}</td>
              <td className="px-6 py-4 text-center text-plum font-bold" dir="ltr">{c.totalSpent} EGP</td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => handleToggleVip(c.id, c.isVip)}
                  disabled={loadingId === c.id}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-opacity ${
                    c.isVip ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-sm" : "bg-cream text-ink hover:bg-line"
                  } disabled:opacity-50`}
                >
                  {loadingId === c.id ? "..." : c.isVip ? "VIP" : "عادي"}
                </button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-ink/50">لا يوجد عملاء حالياً</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
