"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Audience } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/lib/mail";

/* ---------------- تسجيل حساب جديد ---------------- */

export async function registerCustomer(input: {
  name: string;
  phone: string;
  password: string;
  address: string;
}) {
  if (!input.name || !input.phone || !input.password) {
    return { ok: false as const, error: "من فضلك املأ كل الحقول" };
  }
  if (input.password.length < 6) {
    return { ok: false as const, error: "كلمة السر لازم تكون 6 حروف على الأقل" };
  }

  const existing = await prisma.customer.findUnique({ where: { phone: input.phone } });
  if (existing) {
    return { ok: false as const, error: "الرقم ده متسجل بحساب قبل كده" };
  }

  const hashed = await bcrypt.hash(input.password, 10);
  await prisma.customer.create({
    data: {
      name: input.name,
      phone: input.phone,
      password: hashed,
      address: input.address,
    },
  });

  return { ok: true as const };
}

/* ---------------- الطلب (لازم المستخدم يكون مسجل دخول) ---------------- */

export type OrderInput = {
  address: string;
  email?: string;
  items: { id: string; quantity: number; price: number }[];
};

export async function placeOrder(input: OrderInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false as const, error: "لازم تسجل دخول الأول عشان تكمل الطلب" };
  }

  if (!input.address || !input.address.trim()) {
    return { ok: false as const, error: "اكتب العنوان" };
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { ok: false as const, error: "السلة فاضية" };
  }

  // Validate quantities and collect product IDs
  for (const it of input.items) {
    if (!it.id || !Number.isFinite(it.quantity) || it.quantity <= 0 || !Number.isInteger(it.quantity)) {
      return { ok: false as const, error: "كمية غير صالحة في أحد العناصر" };
    }
  }

  const productIds = input.items.map((i) => i.id);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productsById = Object.fromEntries(products.map((p) => [p.id, p]));

  // Verify all products exist and have enough stock; compute canonical total from server prices
  let total = 0;
  for (const item of input.items) {
    const prod = productsById[item.id];
    if (!prod) return { ok: false as const, error: `منتج غير موجود: ${item.id}` };
    if (typeof prod.stock === "number" && prod.stock < item.quantity) {
      return { ok: false as const, error: `المنتج "${prod.name}" لا يتوفر بالكمية المطلوبة` };
    }
    const price = Number(prod.discountPrice ?? prod.price);
    if (!Number.isFinite(price) || price < 0) return { ok: false as const, error: "سعر المنتج غير صالح" };
    total += price * item.quantity;
  }

  try {
    // Use an interactive transaction so all writes happen atomically
    const result = await prisma.$transaction(async (tx) => {
      // update customer address and email
      const updatedCustomer = await tx.customer.update({ 
        where: { id: session.user.id }, 
        data: { 
          address: input.address,
          ...(input.email ? { email: input.email } : {})
        } 
      });

      // create the order with server-side canonical prices
      const createdOrder = await tx.order.create({
        data: {
          customerId: session.user.id,
          total,
          items: {
            create: input.items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: Number(productsById[item.id].discountPrice ?? productsById[item.id].price),
            })),
          },
        },
      });

      // decrement product stock where applicable
      for (const item of input.items) {
        const prod = productsById[item.id];
        if (typeof prod.stock === "number") {
          await tx.product.update({ where: { id: prod.id }, data: { stock: prod.stock - item.quantity } });
        }
      }
      
      // send email if customer has one
      if (updatedCustomer.email) {
        // We don't await this inside the transaction to prevent blocking
        sendOrderConfirmationEmail(updatedCustomer.email, updatedCustomer.name, createdOrder.id, total).catch(console.error);
      }

      return createdOrder;
    });

    return { ok: true as const, orderId: result.id };
  } catch (err) {
    // don't leak internal error details to clients
    console.error("placeOrder error:", err);
    return { ok: false as const, error: "فشل في إنشاء الطلب، حاول مرة تانية" };
  }
}

export async function getMyOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false as const, error: "لازم تسجل دخول الأول" };
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return { ok: true as const, orders };
}

export async function requestReturn(orderId: string, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false as const, error: "لازم تسجل دخول الأول" };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.customerId !== session.user.id) {
    return { ok: false as const, error: "الطلب غير موجود" };
  }

  if (order.status !== "delivered") {
    return { ok: false as const, error: "لا يمكن استرجاع هذا الطلب حالياً" };
  }

  const existingRequest = await prisma.returnRequest.findFirst({ where: { orderId } });
  if (existingRequest) {
    return { ok: false as const, error: "يوجد طلب استرجاع بالفعل لهذا الطلب" };
  }

  await prisma.returnRequest.create({
    data: {
      orderId,
      reason: reason.trim() || "بدون سبب",
    }
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "return_requested" }
  });

  return { ok: true as const };
}

export async function toggleFavorite(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false as const, error: "لازم تسجل دخول أولاً" };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { ok: false as const, error: "المنتج غير موجود" };
  }

  const customer =
    (await prisma.customer.findUnique({ where: { id: session.user.id } })) ??
    (session.user.phone ? await prisma.customer.findUnique({ where: { phone: session.user.phone } }) : null);

  if (!customer) {
    return { ok: false as const, error: "الحساب غير موجود" };
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      customerId_productId: {
        customerId: customer.id,
        productId: product.id,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { ok: true as const, liked: false };
  }

  await prisma.favorite.create({
    data: {
      customerId: customer.id,
      productId: product.id,
    },
  });

  return { ok: true as const, liked: true };
}

export async function updateCustomerProfile(input: {
  name?: string;
  avatarUrl?: string | null;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false as const, error: "لازم تسجل دخول أولاً" };
  }

  const customer =
    (await prisma.customer.findUnique({ where: { id: session.user.id } })) ??
    (session.user.phone ? await prisma.customer.findUnique({ where: { phone: session.user.phone } }) : null);

  if (!customer) {
    return { ok: false as const, error: "الحساب غير موجود" };
  }

  const name = input.name?.trim();
  const avatarUrl = typeof input.avatarUrl === "string" ? input.avatarUrl.trim() || null : input.avatarUrl ?? null;
  let lastNameChangedAt = customer.lastNameChangedAt;

  if (name && name !== customer.name) {
    if (customer.lastNameChangedAt) {
      const daysSinceChange = (new Date().getTime() - new Date(customer.lastNameChangedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceChange < 60) {
        return { ok: false as const, error: `لا يمكنك تغيير الاسم. متبقي ${Math.ceil(60 - daysSinceChange)} يوم` };
      }
    }
    lastNameChangedAt = new Date();
  }

  const updated = await prisma.customer.update({
    where: { id: customer.id },
    data: {
      ...(name && name !== customer.name ? { name, lastNameChangedAt } : {}),
      ...(input.avatarUrl !== undefined ? { avatarUrl } : {}),
    },
  });

  revalidatePath("/", "layout");

  return { ok: true as const, customer: updated };
}

/* ---------------- أدوات مساعدة للتأكد إن اللي بينفذ أدمن ---------------- */

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

/* ---------------- إدارة المنتجات (أدمن بس) ---------------- */

export type ProductInput = {
  name: string;
  nameEn?: string;
  price: number;
  discountPrice?: number | null;
  description?: string;
  descriptionEn?: string;
  stock: number;
  audience: Audience;
  categoryId: string;
  imageUrl?: string | null;
  images?: string[];
};

function normalizeImages(imageUrl?: string | null, images?: string[]) {
  const combined = [...(images ?? []), ...(imageUrl ? [imageUrl] : [])]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  return [...new Set(combined)];
}

export async function createProduct(input: ProductInput) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: "مسموح للأدمن بس" };

  const sanitized = {
    name: input.name.trim(),
    nameEn: input.nameEn?.trim() || null,
    price: Number(input.price),
    discountPrice: typeof input.discountPrice === 'number' && input.discountPrice > 0 ? Number(input.discountPrice) : null,
    description: input.description?.trim() || null,
    descriptionEn: input.descriptionEn?.trim() || null,
    stock: Number(input.stock),
    audience: input.audience,
    categoryId: input.categoryId,
    imageUrl: input.imageUrl?.trim() || (input.images?.[0] ?? null),
    images: normalizeImages(input.imageUrl, input.images),
  };

  await prisma.product.create({ data: sanitized });
  return { ok: true as const };
}

export async function updateProduct(id: string, input: ProductInput) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: "مسموح للأدمن بس" };

  const sanitized = {
    name: input.name.trim(),
    nameEn: input.nameEn?.trim() || null,
    price: Number(input.price),
    discountPrice: typeof input.discountPrice === 'number' && input.discountPrice > 0 ? Number(input.discountPrice) : null,
    description: input.description?.trim() || null,
    descriptionEn: input.descriptionEn?.trim() || null,
    stock: Number(input.stock),
    audience: input.audience,
    categoryId: input.categoryId,
    imageUrl: input.imageUrl?.trim() || (input.images?.[0] ?? null),
    images: normalizeImages(input.imageUrl, input.images),
  };

  await prisma.product.update({ where: { id }, data: sanitized });
  return { ok: true as const };
}

export async function deleteProduct(id: string) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: "مسموح للأدمن بس" };

  await prisma.product.delete({ where: { id } });
  return { ok: true as const };
}

export type CategoryInput = {
  name: string;
  nameEn?: string;
  emoji?: string;
};

export async function createCategory(input: CategoryInput) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: "مسموح للأدمن بس" };

  const name = input.name.trim();
  if (!name) {
    return { ok: false as const, error: "اكتب اسم القسم" };
  }

  const existing = await prisma.category.findFirst({ where: { name } });
  if (existing) {
    return { ok: false as const, error: "القسم موجود بالفعل" };
  }

  await prisma.category.create({
    data: {
      name,
      nameEn: input.nameEn?.trim() || null,
      emoji: input.emoji?.trim() || "✨",
    },
  });

  return { ok: true as const };
}

/* ---------------- إدارة الطلبات (أدمن بس) ---------------- */

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: "مسموح للأدمن بس" };

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  return { ok: true as const };
}

const REVIEW_FORBIDDEN_WORDS = [
  "كسم","كس","شرم","خرا","قحبة","بز","عرص","زق","سكس","سكس","fuck","shit","bitch","ass","dick","porn","sex","nigga","nigger","gay","damn","idiot","stupid"
];

function normalizeReviewText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function rejectReviewContent(value: string) {
  const text = normalizeReviewText(value);
  if (!text) return "اكتب تعليق";
  if (text.length < 3 || text.length > 500) return "التعليق لازم يكون من 3 لحد 500 حرف";
  if (/<[^>]+>|javascript:|on[a-z]+\s*=|script|style\s*=|<\?|\?>/i.test(text)) return "غير مسموح كتابة أكواد أو نصوص خاصة";
  const lower = text.toLowerCase();
  const compactArabic = lower.replace(/[\u064B-\u065F\u0670\u06D4\s\p{P}\p{S}]/gu, "");
  const compactEnglish = lower.replace(/[^a-z]/g, "");
  for (const word of REVIEW_FORBIDDEN_WORDS) {
    if (lower.includes(word) || compactArabic.includes(word) || compactEnglish.includes(word)) {
      return "التعليق يحتوي على كلمات غير مسموحة";
    }
  }
  return "";
}

export async function createProductReview(input: {
  productId: string;
  rating: number;
  comment: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false as const, error: "لازم تسجل الدخول أولاً لكتابة تقييم" };
  }

  const productId = input.productId?.trim();
  if (!productId) return { ok: false as const, error: "منتج غير موجود" };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false as const, error: "المنتج غير موجود" };

  const sanitizedComment = normalizeReviewText(input.comment ?? "");
  const validationError = rejectReviewContent(sanitizedComment);
  if (validationError) return { ok: false as const, error: validationError };

  const rating = Number(input.rating ?? 5);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false as const, error: "التقييم لازم يكون بين 1 و 5" };
  }

  const sessionPhone = (session.user as any)?.phone;
  const customer =
    (await prisma.customer.findUnique({ where: { id: session.user.id } })) ??
    (sessionPhone ? await prisma.customer.findUnique({ where: { phone: sessionPhone } }) : null);

  if (!customer) {
    return { ok: false as const, error: "الحساب غير موجود أو تم تسجيل الخروج، حاول تسجيل الدخول مرة أخرى" };
  }

  const review = await prisma.productReview.create({
    data: {
      productId,
      customerId: customer.id,
      rating,
      comment: sanitizedComment,
    },
  });

  return { ok: true as const, reviewId: review.id, authorName: customer.name };
}
export type OfferBannerInput = {
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  buttonText?: string;
  buttonTextEn?: string;
  imageUrl?: string | null;
  isActive: boolean;
};

export async function upsertOfferBanner(input: OfferBannerInput) {
  const session = await requireAdmin();
  if (!session) return { ok: false as const, error: "مسموح للأدمن بس" };

  const sanitized = {
    title: input.title.trim(),
    titleEn: input.titleEn?.trim() || null,
    subtitle: input.subtitle?.trim() || null,
    subtitleEn: input.subtitleEn?.trim() || null,
    buttonText: input.buttonText?.trim() || null,
    buttonTextEn: input.buttonTextEn?.trim() || null,
    imageUrl: input.imageUrl?.trim() || null,
    isActive: input.isActive,
  };

  // Since we only want one banner for now, we find the first one and update it, or create a new one
  const existing = await prisma.offerBanner.findFirst();

  if (existing) {
    await prisma.offerBanner.update({ where: { id: existing.id }, data: sanitized });
  } else {
    await prisma.offerBanner.create({ data: sanitized });
  }

  return { ok: true as const };
}
