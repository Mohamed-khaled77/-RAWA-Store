import { getDictionary, Locale } from "@/lib/dictionary";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === "en" ? "en" : "ar") as Locale;
  const dict = await getDictionary(validLang);

  const content = {
    ar: {
      title: "تواصل معانا",
      subtitle: "إحنا هنا عشان نساعدك! تقدر تتواصل معانا في أي وقت من خلال الطرق دي:",
      phone: "رقم التليفون / واتساب",
      email: "البريد الإلكتروني",
      address: "العنوان",
      addressText: "القاهرة، مصر (متجر إلكتروني)",
      supportHours: "مواعيد العمل: من 10 صباحاً لـ 10 مساءً يومياً.",
      formTitle: "أو ابعتلنا رسالة مباشرة",
      nameLabel: "الاسم",
      emailLabel: "البريد الإلكتروني أو رقم التليفون",
      messageLabel: "رسالتك",
      sendButton: "إرسال الرسالة",
    },
    en: {
      title: "Contact Us",
      subtitle: "We are here to help! You can reach out to us anytime through:",
      phone: "Phone / WhatsApp",
      email: "Email",
      address: "Address",
      addressText: "Cairo, Egypt (Online Store)",
      supportHours: "Working Hours: 10 AM to 10 PM daily.",
      formTitle: "Or send us a direct message",
      nameLabel: "Name",
      emailLabel: "Email or Phone Number",
      messageLabel: "Your Message",
      sendButton: "Send Message",
    }
  };

  const currentContent = content[validLang];

  return (
    <div className="mx-auto max-w-[800px] px-6 py-12 md:px-8 md:py-20">
      <h1 className="mb-4 font-display text-3xl md:text-5xl text-plum text-center">
        {currentContent.title}
      </h1>
      <p className="mb-12 text-center text-ink/70 text-[15px] md:text-[16px]">
        {currentContent.subtitle}
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
        <div className="flex flex-col items-center rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-light text-plum">
            <FiPhone size={24} />
          </div>
          <h3 className="mb-2 font-bold text-ink">{currentContent.phone}</h3>
          <p className="text-sm text-ink/70" dir="ltr">+20 100 000 0000</p>
        </div>

        <div className="flex flex-col items-center rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-light text-plum">
            <FiMail size={24} />
          </div>
          <h3 className="mb-2 font-bold text-ink">{currentContent.email}</h3>
          <p className="text-sm text-ink/70">support@lamsastore.com</p>
        </div>

        <div className="flex flex-col items-center rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-light text-plum">
            <FiMapPin size={24} />
          </div>
          <h3 className="mb-2 font-bold text-ink">{currentContent.address}</h3>
          <p className="text-sm text-ink/70">{currentContent.addressText}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6 md:p-10 shadow-sm">
        <h2 className="mb-6 font-display text-2xl text-ink text-center">
          {currentContent.formTitle}
        </h2>
        <form className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-ink">{currentContent.nameLabel}</label>
            <input type="text" className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-plum" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-ink">{currentContent.emailLabel}</label>
            <input type="text" className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-plum" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-ink">{currentContent.messageLabel}</label>
            <textarea rows={4} className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-plum resize-none" />
          </div>
          <button type="button" className="mt-2 w-full rounded-xl bg-plum px-6 py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90">
            {currentContent.sendButton}
          </button>
        </form>
      </div>
    </div>
  );
}
