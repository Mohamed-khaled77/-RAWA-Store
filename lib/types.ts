export type ProductCategory = "g" | "b" | "u"; // girls / boys / unisex

export type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  emoji: string;
};

export type CategoryTag = {
  name: string;
  emoji: string;
};
