"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDamagedItem } from "@/lib/admin-actions";

type ProductSummary = { id: string; name: string; stock: number };

export default function DamagedFormClient({ products }: { products: ProductSummary[] }) {
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const selectedProduct = products.find(p => p.id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0) return;
    
    setLoading(true);
    const res = await addDamagedItem(productId, quantity, reason);
    setLoading(false);

    if (res.ok) {
      setQuantity(1);
      setReason("");
      router.refresh(); // Refresh page to show new item and updated stock
    } else {
      alert(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-bold text-ink">اختر المنتج</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full rounded-xl border border-line bg-cream/40 px-3 py-2 text-sm text-ink outline-none focus:border-plum"
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} (المخزون: {p.stock})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-ink">الكمية التالفة</label>
        <input
          type="number"
          min="1"
          max={selectedProduct?.stock || 1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full rounded-xl border border-line bg-cream/40 px-3 py-2 text-sm text-ink outline-none focus:border-plum"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-ink">السبب</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="مثال: مكسور أثناء الشحن، عيب مصنعي..."
          className="w-full resize-none rounded-xl border border-line bg-cream/40 px-3 py-2 text-sm text-ink outline-none focus:border-plum"
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !productId}
        className="w-full rounded-full bg-rose px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "جارٍ الحفظ..." : "تأكيد خصم الهالك"}
      </button>
    </form>
  );
}
