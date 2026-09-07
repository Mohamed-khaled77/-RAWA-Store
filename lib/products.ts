import { Product, CategoryTag } from "./types";

// بيانات وهمية مؤقتة. في المرحلة الجاية هنجيبها من قاعدة البيانات عن طريق Prisma.
export const products: Product[] = [
  { id: "1", name: "روج مطفي وردي", price: 85, category: "g", emoji: "💄" },
  { id: "2", name: "ساعة كاجوال سوداء", price: 220, category: "b", emoji: "⌚" },
  { id: "3", name: "طقم كليبس ذهبي", price: 60, category: "g", emoji: "🎀" },
  { id: "4", name: "نظارة شمس كلاسيك", price: 140, category: "u", emoji: "🕶️" },
  { id: "5", name: "خاتم فضة مطلي", price: 95, category: "g", emoji: "💍" },
  { id: "6", name: "كاب رياضي بيج", price: 130, category: "b", emoji: "🧢" },
  { id: "7", name: "محفظة جلد بني", price: 175, category: "b", emoji: "👛" },
  { id: "8", name: "بادي سبراي فانيليا", price: 110, category: "u", emoji: "✨" },
];

export const categories: CategoryTag[] = [
  { name: "ميك أب", emoji: "💄" },
  { name: "إكسسوارات شعر", emoji: "🎀" },
  { name: "مجوهرات", emoji: "💍" },
  { name: "كابات وقبعات", emoji: "🧢" },
  { name: "محافظ", emoji: "👛" },
  { name: "نظارات وعطور", emoji: "🕶️" },
];
