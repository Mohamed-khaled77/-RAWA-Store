import { prisma } from "@/lib/prisma";
import DamagedFormClient from "@/components/DamagedFormClient";

export default async function DamagedPage() {
  const [products, damagedItems] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, stock: true } }),
    prisma.damagedItem.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">إدارة المرتجع الهالك والمفقود</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="rounded-[24px] border border-line bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-bold text-ink">تسجيل هالك جديد</h2>
            <DamagedFormClient products={products} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="overflow-hidden rounded-[24px] border border-line bg-white shadow-sm">
            <table className="w-full text-sm text-ink">
              <thead className="bg-cream text-right">
                <tr>
                  <th className="px-6 py-4 font-bold">التاريخ</th>
                  <th className="px-6 py-4 font-bold">المنتج</th>
                  <th className="px-6 py-4 font-bold text-center">الكمية</th>
                  <th className="px-6 py-4 font-bold">السبب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {damagedItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4" dir="ltr">{new Date(item.createdAt).toLocaleDateString("ar-EG")}</td>
                    <td className="px-6 py-4 font-bold">{item.product.name}</td>
                    <td className="px-6 py-4 text-center font-bold text-rose">{item.quantity}</td>
                    <td className="px-6 py-4">{item.reason}</td>
                  </tr>
                ))}
                {damagedItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-ink/50">لا توجد سجلات هالك حالياً</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
