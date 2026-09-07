"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, createProduct, updateProduct, deleteProduct } from "@/lib/actions";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  nameEn?: string | null;
  price: number;
  discountPrice?: number | null;
  description?: string | null;
  descriptionEn?: string | null;
  stock: number;
  audience: "GIRLS" | "BOYS" | "UNISEX";
  imageUrl?: string | null;
  images?: string[];
  categoryId: string;
  category: { name: string };
};

const AUDIENCE_LABEL: Record<Product["audience"], string> = {
  GIRLS: "بنات",
  BOYS: "ولاد",
  UNISEX: "مشترك",
};

const emptyForm = {
  name: "",
  nameEn: "",
  price: "",
  discountPrice: "",
  description: "",
  descriptionEn: "",
  stock: "10",
  audience: "GIRLS" as Product["audience"],
  categoryId: "",
  imageUrl: "",
  images: [] as string[],
};

export default function ProductsAdmin({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [categoryForm, setCategoryForm] = useState({ name: "", nameEn: "", emoji: "✨" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      nameEn: p.nameEn ?? "",
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      description: p.description ?? "",
      descriptionEn: p.descriptionEn ?? "",
      stock: String(p.stock),
      audience: p.audience,
      categoryId: p.categoryId,
      imageUrl: p.imageUrl ?? "",
      images: Array.isArray(p.images) ? p.images : p.imageUrl ? [p.imageUrl] : [],
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.categoryId) {
      setError("املأ كل الحقول الأساسية");
      return;
    }

    setLoading(true);
    const payload = {
      name: form.name,
      nameEn: form.nameEn || undefined,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      description: form.description,
      descriptionEn: form.descriptionEn || undefined,
      stock: Number(form.stock),
      audience: form.audience,
      categoryId: form.categoryId,
      imageUrl: form.imageUrl || form.images[0] || null,
      images: form.images.length > 0 ? form.images : form.imageUrl ? [form.imageUrl] : [],
    };

    const res = editingId
      ? await updateProduct(editingId, payload)
      : await createProduct(payload);

    setLoading(false);

    if (!res.ok) {
      setError(res.error ?? "حصل خطأ");
      return;
    }

    resetForm();
    router.refresh();
  }

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!categoryForm.name.trim()) {
      setError("اكتب اسم القسم");
      return;
    }

    setCategoryLoading(true);
    const res = await createCategory({
      name: categoryForm.name,
      nameEn: categoryForm.nameEn || undefined,
      emoji: categoryForm.emoji,
    });
    setCategoryLoading(false);

    if (!res.ok) {
      setError(res.error ?? "حصل خطأ في إضافة القسم");
      return;
    }

    setCategoryForm({ name: "", nameEn: "", emoji: "✨" });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("متأكد إنك عايز تحذف المنتج ده؟")) return;
    await deleteProduct(id);
    router.refresh();
  }

  async function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setLoading(true);

    try {
      const urls = await Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const img = new Image();
              const objectUrl = URL.createObjectURL(file);
              img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                  if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                  }
                } else {
                  if (height > MAX_HEIGHT) {
                    width = Math.round((width * MAX_HEIGHT) / height);
                    height = MAX_HEIGHT;
                  }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(async (blob) => {
                  if (!blob) return reject(new Error("Compression failed"));
                  
                  const formData = new FormData();
                  formData.append("file", blob, file.name);
                  
                  try {
                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                    const data = await res.json();
                    if (res.ok) resolve(data.url);
                    else reject(new Error(data.error));
                  } catch (err) {
                    reject(err);
                  }
                }, "image/jpeg", 0.8);
                
                URL.revokeObjectURL(objectUrl);
              };
              img.onerror = () => reject(new Error("فشل في قراءة الصورة"));
              img.src = objectUrl;
            })
        )
      );

      setForm((current) => ({
        ...current,
        imageUrl: urls[0] ?? current.imageUrl,
        images: [...new Set([...current.images, ...urls].filter(Boolean))],
      }));
    } catch (err) {
      setError("فشل في رفع الصور");
    }

    setLoading(false);
    event.target.value = "";
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink">المنتجات</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 gap-3 rounded-xl border border-line bg-white p-5 md:grid-cols-2"
      >
        <input
          placeholder="اسم المنتج (عربي)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
        />
        <input
          placeholder="اسم المنتج (إنجليزي)"
          value={form.nameEn}
          onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
        />

        <textarea
          placeholder="تفاصيل المنتج (عربي)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
        />
        <textarea
          placeholder="تفاصيل المنتج (إنجليزي)"
          value={form.descriptionEn}
          onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
          rows={3}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-1"
        />

        <input
          placeholder="السعر الأساسي"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        />
        <input
          placeholder="السعر بعد الخصم (اختياري)"
          type="number"
          value={form.discountPrice}
          onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        />
        <input
          placeholder="المخزون"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        />
        <select
          value={form.audience}
          onChange={(e) =>
            setForm({ ...form, audience: e.target.value as Product["audience"] })
          }
          className="rounded-lg border border-line px-3 py-2 text-sm"
        >
          <option value="GIRLS">بنات</option>
          <option value="BOYS">ولاد</option>
          <option value="UNISEX">مشترك</option>
        </select>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        >
          <option value="">اختار القسم</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="روابط صور المنتج (سطر لكل صورة)"
          value={form.images.join("\n") || form.imageUrl}
          onChange={(e) => {
            const lines = e.target.value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
            setForm({
              ...form,
              imageUrl: lines[0] ?? "",
              images: lines,
            });
          }}
          rows={3}
          className="rounded-lg border border-line px-3 py-2 text-sm md:col-span-2"
        />

        <label className="flex items-center justify-center rounded-lg border border-dashed border-line bg-cream px-3 py-2 text-sm font-bold text-ink md:col-span-2">
          <input type="file" accept="image/*" multiple onChange={handleImageSelection} className="hidden" />
          رفع صور من الجهاز
        </label>

        {form.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 md:col-span-2">
            {form.images.slice(0, 4).map((image, index) => (
              <div key={`${image}-${index}`} className="relative overflow-hidden rounded-lg border border-line bg-cream">
                <img src={image} alt={`صورة ${index + 1}`} className="h-20 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, images: current.images.filter((item) => item !== image) }))}
                  className="absolute left-1 top-1 rounded-full bg-white/90 px-1.5 text-[10px] font-bold text-ink"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-plum px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {editingId ? "حفظ التعديل" : "إضافة منتج"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-line px-5 py-2 text-sm font-bold"
            >
              إلغاء
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
      </form>

      <form
        onSubmit={handleCategorySubmit}
        className="mb-8 flex flex-col gap-3 rounded-xl border border-line bg-white p-5 md:flex-row md:items-end"
      >
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold text-ink/70">اسم القسم الجديد (عربي)</label>
          <input
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            placeholder="مثل: حقائب أو أزياء"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold text-ink/70">الاسم (إنجليزي)</label>
          <input
            value={categoryForm.nameEn}
            onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
            placeholder="e.g: Bags or Fashion"
            className="w-full rounded-lg border border-line px-3 py-2 text-sm"
          />
        </div>
        <div className="w-28">
          <label className="mb-1 block text-xs font-bold text-ink/70">إيموجي</label>
          <input
            value={categoryForm.emoji}
            onChange={(e) => setCategoryForm({ ...categoryForm, emoji: e.target.value })}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={categoryLoading}
          className="rounded-lg border border-line bg-cream px-5 py-2 text-sm font-bold text-ink disabled:opacity-60"
        >
          {categoryLoading ? "جارٍ الإضافة..." : "إضافة قسم"}
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-cream text-right">
            <tr>
              <th className="px-4 py-3">الاسم</th>
              <th className="px-4 py-3">القسم</th>
              <th className="px-4 py-3">الفئة</th>
              <th className="px-4 py-3">السعر</th>
              <th className="px-4 py-3">المخزون</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-bold">{p.name}</td>
                <td className="px-4 py-3 text-ink/60">{p.category.name}</td>
                <td className="px-4 py-3 text-ink/60">{AUDIENCE_LABEL[p.audience]}</td>
                <td className="px-4 py-3">
                  {p.discountPrice ? (
                    <div className="flex flex-col">
                      <span className="text-plum font-bold">{p.discountPrice} ج.م</span>
                      <span className="text-xs line-through text-ink/40">{p.price} ج.م</span>
                    </div>
                  ) : (
                    <span>{p.price} ج.م</span>
                  )}
                </td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-xs font-bold text-plum"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs font-bold text-red-600"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
