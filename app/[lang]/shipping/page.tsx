import { getDictionary, Locale } from "@/lib/dictionary";

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === "en" ? "en" : "ar") as Locale;
  const dict = await getDictionary(validLang);

  const content = {
    ar: {
      title: "سياسة الشحن والاستبدال",
      shippingTitle: "معلومات الشحن والتوصيل",
      shippingDesc: "بنقدم خدمة توصيل سريعة لجميع محافظات مصر عشان طلبك يوصلك في أسرع وقت.",
      shippingPoints: [
        "القاهرة والجيزة: التوصيل خلال 24 - 48 ساعة.",
        "المحافظات الأخرى: التوصيل خلال 2 - 4 أيام عمل.",
        "رسوم الشحن: بيتم تحديدها في صفحة الدفع بناءً على المحافظة.",
        "كل الطلبات بيتم تأكيدها تليفونياً قبل الشحن."
      ],
      returnTitle: "سياسة الاستبدال والاسترجاع",
      returnDesc: "عشان رضاك يهمنا، تقدر تستبدل أو ترجع أي منتج بكل سهولة وفقاً للشروط دي:",
      returnPoints: [
        "مدة الاستبدال: معاك لحد 14 يوم من تاريخ استلام الطلب.",
        "حالة المنتج: لازم يكون المنتج في حالته الأصلية، بالغلاف بتاعه، وما تمش استخدامه.",
        "الاسترجاع: ممكن ترجع المنتج لو فيه عيب صناعة، أو لو وصلك منتج مختلف عن اللي طلبته.",
        "طريقة طلب الاستبدال: ابعتلنا رسالة على واتساب برقم الطلب وصورة المنتج، وفريقنا هيساعدك فوراً."
      ],
      contactTitle: "عندك استفسار؟",
      contactDesc: "لو عندك أي سؤال بخصوص طلبك، تواصل معانا فوراً وهنرد عليك في أسرع وقت."
    },
    en: {
      title: "Shipping & Exchange Policy",
      shippingTitle: "Shipping & Delivery Information",
      shippingDesc: "We offer fast delivery to all governorates in Egypt to ensure you get your order as soon as possible.",
      shippingPoints: [
        "Cairo & Giza: Delivery within 24 - 48 hours.",
        "Other Governorates: Delivery within 2 - 4 business days.",
        "Shipping Fees: Calculated at checkout based on your location.",
        "All orders are confirmed via phone call before dispatch."
      ],
      returnTitle: "Exchange & Return Policy",
      returnDesc: "Your satisfaction is our priority. You can easily exchange or return any product according to these conditions:",
      returnPoints: [
        "Exchange Period: You have up to 14 days from the date of receiving your order.",
        "Product Condition: The product must be in its original condition, packaging, and unused.",
        "Returns: You can return the product if there is a manufacturing defect or if you received the wrong item.",
        "How to request: Send us a WhatsApp message with your order number and a picture of the product, and our team will assist you immediately."
      ],
      contactTitle: "Have a Question?",
      contactDesc: "If you have any questions regarding your order, contact us and we will respond as soon as possible."
    }
  };

  const currentContent = content[validLang];

  return (
    <div className="mx-auto max-w-[800px] px-6 py-12 md:px-8 md:py-20">
      <h1 className="mb-10 font-display text-3xl md:text-5xl text-plum text-center">
        {currentContent.title}
      </h1>

      <div className="space-y-12">
        <section className="rounded-2xl border border-line bg-white p-6 md:p-10 shadow-sm">
          <h2 className="mb-4 font-display text-2xl text-ink">
            {currentContent.shippingTitle}
          </h2>
          <p className="mb-6 text-ink/80 text-[15px] leading-relaxed">
            {currentContent.shippingDesc}
          </p>
          <ul className="space-y-3">
            {currentContent.shippingPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-ink/70 text-[14px]">
                <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-plum" />
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-white p-6 md:p-10 shadow-sm">
          <h2 className="mb-4 font-display text-2xl text-ink">
            {currentContent.returnTitle}
          </h2>
          <p className="mb-6 text-ink/80 text-[15px] leading-relaxed">
            {currentContent.returnDesc}
          </p>
          <ul className="space-y-3">
            {currentContent.returnPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-ink/70 text-[14px]">
                <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-plum" />
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-rose-light p-6 md:p-10 text-center">
          <h2 className="mb-3 font-display text-2xl text-plum-dark">
            {currentContent.contactTitle}
          </h2>
          <p className="text-plum-dark/80 text-[15px]">
            {currentContent.contactDesc}
          </p>
        </section>
      </div>
    </div>
  );
}
