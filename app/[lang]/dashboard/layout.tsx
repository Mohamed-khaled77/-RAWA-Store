import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 flex-none border-l border-line bg-white px-5 py-8">
        <div className="mb-8 font-display text-2xl text-plum">روا</div>
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="block rounded-lg px-3 py-2 text-sm font-bold hover:bg-cream"
          >
            نظرة عامة
          </Link>
          <Link
            href="/dashboard/products"
            className="block rounded-lg px-3 py-2 text-sm font-bold hover:bg-cream"
          >
            المنتجات
          </Link>
          <Link
            href="/dashboard/orders"
            className="block rounded-lg px-3 py-2 text-sm font-bold hover:bg-cream"
          >
            الطلبات
          </Link>
          <Link
            href="/dashboard/offers"
            className="block rounded-lg px-3 py-2 text-sm font-bold text-plum hover:bg-plum/10"
          >
            العروض والبانر
          </Link>
          <Link
            href="/dashboard/returns"
            className="block rounded-lg px-3 py-2 text-sm font-bold hover:bg-cream"
          >
            المرتجعات
          </Link>
          <Link
            href="/dashboard/damaged"
            className="block rounded-lg px-3 py-2 text-sm font-bold text-rose hover:bg-rose-light/50"
          >
            الهالك والمفقود
          </Link>
          <Link
            href="/dashboard/customers"
            className="block rounded-lg px-3 py-2 text-sm font-bold hover:bg-cream"
          >
            العملاء والـ VIP
          </Link>
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm font-bold text-ink/50 hover:bg-cream"
          >
            رجوع للمتجر
          </Link>
        </nav>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 bg-cream p-8">{children}</main>
    </div>
  );
}
