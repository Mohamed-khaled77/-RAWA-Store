"use client";

import { FiTrendingUp, FiUsers, FiBox, FiShoppingBag } from "react-icons/fi";

type StatsProps = {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  lowStockCount: number;
};

export default function DashboardStats({ stats }: { stats: StatsProps }) {
  const cards = [
    { title: "إجمالي الأرباح", value: `${stats.totalRevenue} جنيه`, icon: FiTrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { title: "الطلبات المكتملة", value: stats.totalOrders, icon: FiShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "العملاء", value: stats.totalUsers, icon: FiUsers, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "منتجات قاربت على النفاذ", value: stats.lowStockCount, icon: FiBox, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${card.bg} ${card.color}`}>
            <card.icon className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink/60">{card.title}</h3>
            <p className="font-display text-2xl text-ink">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
