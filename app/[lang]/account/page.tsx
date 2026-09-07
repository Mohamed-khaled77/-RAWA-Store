import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountProfileClient from "@/components/AccountProfileClient";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const STATUS_LABEL: Record<string, string> = {
  pending: "قيد التجهيز",
  paid: "تم الدفع",
  shipped: "في الطريق",
  delivered: "تم التوصيل",
};

export default async function AccountPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id },
    include: {
      favorites: {
        include: {
          product: true,
        },
        orderBy: { createdAt: "desc" },
      },
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!customer) redirect("/login");

  const favoriteProducts = customer.favorites.map((favorite) => ({
    id: favorite.product.id,
    name: favorite.product.name,
    price: favorite.product.price,
    imageUrl: favorite.product.imageUrl,
    images: favorite.product.images,
  }));

  const purchasedProducts = customer.orders.flatMap((order) =>
    order.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      imageUrl: item.product.imageUrl,
      images: item.product.images,
      status: order.status,
      date: order.createdAt,
    }))
  );

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-ink font-bold hover:text-girls transition-colors">
          <FiArrowRight className="text-xl" />
          العودة للمتجر
        </Link>
        <LogoutButton />
      </div>

      <AccountProfileClient
        initialName={customer.name}
        initialAvatarUrl={customer.avatarUrl}
        phone={customer.phone}
        favoriteProducts={favoriteProducts}
        numericId={customer.numericId}
        isVip={customer.isVip}
        lastNameChangedAt={customer.lastNameChangedAt}
      />

      <div className="mt-8 rounded-[28px] border border-line bg-white p-6 shadow-[0_14px_30px_rgba(58,41,49,0.06)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">الطلبات</h2>
          <span className="text-sm text-ink/60">{customer.orders.length} طلب</span>
        </div>

        {customer.orders.length === 0 ? (
          <p className="text-sm text-ink/60">لسه معملتش أي طلب.</p>
        ) : (
          <div className="space-y-4">
            {customer.orders.map((order) => (
              <div key={order.id} className="rounded-[24px] border border-line bg-cream/20 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-ink/55">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
                    <p className="mt-1 text-sm font-bold text-ink">رقم الطلب: {order.id.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`/${lang}/account/orders/${order.id}/invoice`} target="_blank" className="rounded-full bg-white border border-line px-3 py-1 text-[12px] font-bold text-ink hover:bg-cream transition-colors">
                      فاتورة
                    </a>
                    {order.status === 'delivered' && (
                      <a href={`/${lang}/account/orders/${order.id}/return`} className="rounded-full bg-white border border-rose text-rose-500 px-3 py-1 text-[12px] font-bold hover:bg-rose-light transition-colors">
                        استرجاع
                      </a>
                    )}
                    <span className="rounded-full bg-rose-light px-3 py-1 text-[12px] font-bold text-girls">
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-xl border border-line bg-cream">
                          {item.product.imageUrl || item.product.images?.[0] ? (
                            <img src={item.product.imageUrl ?? item.product.images?.[0] ?? undefined} alt={item.product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl">✨</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-ink">{item.product.name}</p>
                          <p className="text-xs text-ink/60">الكمية: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-girls">{item.price * item.quantity} جنيه</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t border-line pt-3 text-sm font-bold">
                  <span>الإجمالي</span>
                  <span className="text-girls">{order.total} جنيه</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {purchasedProducts.length > 0 && (
        <div className="mt-8 rounded-[28px] border border-line bg-white p-6 shadow-[0_14px_30px_rgba(58,41,49,0.06)]">
          <h2 className="mb-5 font-display text-2xl text-ink">المنتجات اللي اشتريت</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {purchasedProducts.map((product, index) => (
              <div key={`${product.id}-${index}`} className="overflow-hidden rounded-[22px] border border-line bg-cream/30">
                <div className="h-40 overflow-hidden">
                  {product.imageUrl || product.images?.[0] ? (
                    <img src={product.imageUrl ?? product.images?.[0] ?? undefined} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-cream text-4xl">✨</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-ink">{product.name}</p>
                  <p className="mt-2 text-xs text-ink/60">الكمية: {product.quantity}</p>
                  <p className="mt-2 text-sm text-girls">{product.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
