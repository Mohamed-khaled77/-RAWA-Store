import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiPrinter, FiArrowRight } from "react-icons/fi";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${lang}/login`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) redirect(`/${lang}/account`);
  
  // Ensure the user is the owner of the order or an admin
  if (order.customerId !== session.user.id && session.user.role !== "ADMIN") {
    redirect(`/${lang}/account`);
  }

  return (
    <div className="min-h-screen bg-[#F8F3ED] px-4 py-8 md:p-12">
      {/* Non-printable header */}
      <div className="mx-auto mb-8 max-w-3xl flex items-center justify-between print:hidden">
        <Link href={`/${lang}/account`} className="flex items-center gap-2 text-ink/70 hover:text-plum transition-colors font-bold">
          <FiArrowRight /> الرجوع للحساب
        </Link>
        <button 
          id="print-invoice-btn"
          className="flex items-center gap-2 rounded-xl bg-plum px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
          style={{ cursor: 'pointer' }}
        >
          <FiPrinter /> طباعة الفاتورة
        </button>
      </div>

      {/* Printable Invoice Area */}
      <div className="mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-line print:shadow-none print:border-none print:m-0 print:p-0">
        <div className="mb-10 flex items-start justify-between border-b border-line pb-8">
          <div>
            <h1 className="font-display text-4xl text-plum mb-1">Lamsa Store</h1>
            <p className="text-ink/60 text-sm">أفضل متجر إلكتروني للميك أب والإكسسوارات</p>
          </div>
          <div className="text-left">
            <h2 className="font-display text-2xl text-ink">فاتورة طلب</h2>
            <p className="text-ink/60 font-bold" dir="ltr">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <div className="mb-10 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="mb-2 text-sm font-bold text-ink/50 uppercase">تفاصيل العميل</h3>
            <p className="font-bold text-ink">{order.customer.name}</p>
            <p className="text-sm text-ink/80 mt-1">{order.customer.phone}</p>
            <p className="text-sm text-ink/80 mt-1">{order.customer.address || "بدون عنوان"}</p>
          </div>
          <div className="md:text-left">
            <h3 className="mb-2 text-sm font-bold text-ink/50 uppercase">تفاصيل الطلب</h3>
            <p className="text-sm font-bold text-ink mb-1">
              تاريخ الطلب: <span className="font-normal">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</span>
            </p>
            <p className="text-sm font-bold text-ink">
              حالة الطلب: <span className="font-normal">{order.status === 'delivered' ? 'تم التوصيل' : 'قيد التجهيز / جاري'}</span>
            </p>
          </div>
        </div>

        <div className="mb-10">
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-cream/40 text-ink">
                <tr>
                  <th className="p-4 text-right font-bold">المنتج</th>
                  <th className="p-4 text-center font-bold">السعر</th>
                  <th className="p-4 text-center font-bold">الكمية</th>
                  <th className="p-4 text-left font-bold">المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {order.items.map((item) => (
                  <tr key={item.id} className="text-ink">
                    <td className="p-4 text-right">
                      <p className="font-bold">{item.product.name}</p>
                    </td>
                    <td className="p-4 text-center font-bold" dir="ltr">{item.price} EGP</td>
                    <td className="p-4 text-center font-bold">{item.quantity}</td>
                    <td className="p-4 text-left font-bold text-plum" dir="ltr">{item.price * item.quantity} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end border-t border-line pt-6">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-sm font-bold text-ink/70">
              <span>المجموع الفرعي</span>
              <span dir="ltr">{order.total} EGP</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-ink/70">
              <span>مصاريف الشحن</span>
              <span>تحدد عند الاستلام</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-black text-plum">
              <span>الإجمالي (بدون شحن)</span>
              <span dir="ltr">{order.total} EGP</span>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center border-t border-line pt-8">
          <p className="font-bold text-ink text-sm">شكراً لتسوقك من Lamsa Store! 💖</p>
          <p className="text-ink/60 text-xs mt-1">إذا كان لديك أي استفسار، تواصل معنا عبر صفحة المساعدة.</p>
        </div>
      </div>
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Attach print event safely
            const printBtns = document.querySelectorAll('#print-invoice-btn');
            printBtns.forEach(btn => {
              btn.addEventListener('click', () => window.print());
            });
          `
        }}
      />
    </div>
  );
}
