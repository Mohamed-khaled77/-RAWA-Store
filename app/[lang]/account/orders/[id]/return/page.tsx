import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ReturnFormClient from "@/components/ReturnFormClient";

export default async function ReturnPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${lang}/login`);

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order || order.customerId !== session.user.id) {
    redirect(`/${lang}/account`);
  }

  if (order.status !== "delivered") {
    return (
      <div className="mx-auto max-w-[800px] px-6 py-20 text-center">
        <h1 className="mb-4 font-display text-3xl text-plum">عذراً</h1>
        <p className="mb-8 text-ink/70">لا يمكن استرجاع هذا الطلب لأن حالته ليست "تم التوصيل".</p>
        <Link href={`/${lang}/account`} className="rounded-full bg-plum px-6 py-3 font-bold text-white">الرجوع للحساب</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3ED] px-4 py-8 md:p-12">
      <div className="mx-auto max-w-2xl">
        <Link href={`/${lang}/account`} className="mb-8 flex items-center gap-2 text-ink/70 hover:text-plum transition-colors font-bold w-fit">
          <FiArrowRight /> الرجوع للحساب
        </Link>
        
        <div className="rounded-3xl border border-line bg-white p-8 md:p-10 shadow-[0_14px_30px_rgba(58,41,49,0.06)]">
          <h1 className="font-display text-3xl text-ink mb-2">طلب استرجاع</h1>
          <p className="text-ink/60 text-sm font-bold mb-8">رقم الطلب: <span dir="ltr">{order.id.slice(0, 8)}</span></p>

          <div className="rounded-2xl bg-cream/40 p-5 mb-8 text-sm text-ink/80 leading-relaxed border border-line">
            <h3 className="font-bold text-plum mb-2">شروط الاسترجاع:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>يجب أن يكون المنتج في حالته الأصلية بالغلاف.</li>
              <li>المدة المسموحة للاسترجاع هي 14 يوماً من تاريخ الاستلام.</li>
              <li>سيتم مراجعة الطلب من قبل الإدارة وسيصلك مندوبنا قريباً.</li>
            </ul>
          </div>

          <ReturnFormClient orderId={order.id} />
        </div>
      </div>
    </div>
  );
}
