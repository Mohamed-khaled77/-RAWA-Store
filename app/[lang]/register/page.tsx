"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerCustomer } from "@/lib/actions";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await registerCustomer({ name, phone, password, address });
    if (!res.ok) {
      setLoading(false);
      setError(res.error);
      return;
    }

    // بعد التسجيل مباشرة نسجّله دخول تلقائي
    const login = await signIn("credentials", { phone, password, redirect: false });
    setLoading(false);

    if (login?.error) {
      router.push("/login");
      return;
    }
    router.push("/");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-2 font-display text-3xl text-ink">حساب جديد</h1>
      <p className="mb-8 text-sm text-ink/60">اعمل حساب عشان تتابع طلباتك بسهولة.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="الاسم" value={name} onChange={setName} />
        <Field label="رقم الموبايل" value={phone} onChange={setPhone} type="tel" placeholder="01xxxxxxxxx" />
        <Field label="كلمة السر" value={password} onChange={setPassword} type="password" placeholder="6 حروف على الأقل" />
        <Field label="العنوان" value={address} onChange={setAddress} textarea />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-plum py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "بنسجلك..." : "اعمل حساب"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        عندك حساب؟{" "}
        <Link href="/login" className="font-bold text-plum">
          سجل دخول
        </Link>
      </p>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm"
        />
      )}
    </div>
  );
}
