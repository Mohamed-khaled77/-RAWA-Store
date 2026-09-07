import { PrismaClient, Audience, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("بنمسح البيانات القديمة (لو موجودة)...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();

  console.log("بنعمل حساب الأدمن...");
  const adminPassword = await bcrypt.hash("admin123456", 10);
  await prisma.customer.create({
    data: {
      name: "الإدارة",
      phone: "01000000000",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log("بنضيف الأقسام...");
  const categoryData = [
    { name: "ميك أب", emoji: "💄" },
    { name: "إكسسوارات شعر", emoji: "🎀" },
    { name: "مجوهرات", emoji: "💍" },
    { name: "كابات وقبعات", emoji: "🧢" },
    { name: "محافظ", emoji: "👛" },
    { name: "نظارات وعطور", emoji: "🕶️" },
  ];

  const categories = await Promise.all(
    categoryData.map((c) => prisma.category.create({ data: c }))
  );

  const findCat = (name: string) => categories.find((c) => c.name === name)!.id;

  console.log("بنضيف المنتجات...");
  await prisma.product.createMany({
    data: [
      { name: "روج مطفي وردي", price: 85, audience: Audience.GIRLS, categoryId: findCat("ميك أب") },
      { name: "ساعة كاجوال سوداء", price: 220, audience: Audience.BOYS, categoryId: findCat("نظارات وعطور") },
      { name: "طقم كليبس ذهبي", price: 60, audience: Audience.GIRLS, categoryId: findCat("إكسسوارات شعر") },
      { name: "نظارة شمس كلاسيك", price: 140, audience: Audience.UNISEX, categoryId: findCat("نظارات وعطور") },
      { name: "خاتم فضة مطلي", price: 95, audience: Audience.GIRLS, categoryId: findCat("مجوهرات") },
      { name: "كاب رياضي بيج", price: 130, audience: Audience.BOYS, categoryId: findCat("كابات وقبعات") },
      { name: "محفظة جلد بني", price: 175, audience: Audience.BOYS, categoryId: findCat("محافظ") },
      { name: "بادي سبراي فانيليا", price: 110, audience: Audience.UNISEX, categoryId: findCat("نظارات وعطور") },
    ],
  });

  console.log("تم بنجاح ✅");
  console.log("");
  console.log("بيانات دخول الأدمن:");
  console.log("رقم الموبايل: 01000000000");
  console.log("كلمة السر: admin123456");
  console.log("(غيّرها بعدين من داخل قاعدة البيانات أو اعمل حساب أدمن جديد)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
