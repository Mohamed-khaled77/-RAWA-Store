"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { phone, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("رقم الموبايل أو كلمة السر غلط");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-8 font-display text-3xl text-ink">تسجيل الدخول</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-bold">رقم الموبايل</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01xxxxxxxxx"
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold">كلمة السر</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-plum py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "بندخل..." : "دخول"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        لسه معملتش حساب؟{" "}
        <Link href="/register" className="font-bold text-plum">
          اعمل حساب جديد
        </Link>
      </p>
    </main>
  );
}
