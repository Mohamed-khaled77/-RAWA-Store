"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestReturn } from "@/lib/actions";

export default function ReturnFormClient({ orderId }: { orderId: string }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await requestReturn(orderId, reason);
    if (res.ok) {
      setMessage("تم تسجيل طلب الاسترجاع بنجاح. سيتم التواصل معك قريباً.");
      setTimeout(() => {
        router.push("/account");
      }, 2000);
    } else {
      setMessage(res.error || "حدث خطأ ما");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label className="mb-2 block text-sm font-bold text-ink">سبب الاسترجاع</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={4}
          className="w-full resize-none rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-plum"
          placeholder="وضح لنا سبب رغبتك في استرجاع الطلب..."
        />
      </div>

      {message && (
        <div className={`rounded-xl p-4 text-sm font-bold ${message.includes("بنجاح") ? "bg-green-100 text-green-800" : "bg-rose-light text-rose"}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-plum px-6 py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "جارٍ الإرسال..." : "تأكيد طلب الاسترجاع"}
      </button>
    </form>
  );
}
