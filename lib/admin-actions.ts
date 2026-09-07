"use server";

import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function toggleVipStatus(customerId: string, isVip: boolean) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: "مسموح للأدمن بس" };

  await prisma.customer.update({
    where: { id: customerId },
    data: { isVip }
  });

  return { ok: true as const };
}

export async function updateReturnRequestStatus(requestId: string, status: string) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: "مسموح للأدمن بس" };

  await prisma.returnRequest.update({
    where: { id: requestId },
    data: { status }
  });

  return { ok: true as const };
}

export async function addDamagedItem(productId: string, quantity: number, reason: string) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: "مسموح للأدمن بس" };

  if (quantity <= 0) return { ok: false as const, error: "الكمية لازم تكون أكبر من 0" };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false as const, error: "المنتج غير موجود" };
  
  if (product.stock < quantity) return { ok: false as const, error: "كمية الهالك أكبر من المخزون المتوفر!" };

  await prisma.$transaction(async (tx) => {
    await tx.damagedItem.create({
      data: {
        productId,
        quantity,
        reason: reason.trim() || "غير محدد",
      }
    });

    await tx.product.update({
      where: { id: productId },
      data: { stock: product.stock - quantity }
    });
  });

  return { ok: true as const };
}
