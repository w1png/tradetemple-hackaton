import { type inferProcedureOutput } from "@trpc/server";
import { Category, Product } from "@prisma/client";
import { AppRouter } from "./server/api/root";

export const categories = [
  {
    title: "Электроника",
    image: "/electronics.png",
    url: "/categories/electronics",
    value: Category.ELECTRONICS,
  },
  {
    title: "Для дачи и дома",
    image: "/house.png",
    url: "/categories/house",
    value: Category.HOME,
  },
  {
    title: "Товары для хобби и отдыха",
    image: "/hobby.png",
    url: "/categories/hobby",
    value: Category.HOBBY,
  },
  {
    title: "Животные и товары для них",
    image: "/pets.png",
    url: "/categories/pets",
    value: Category.PETS
  },
  {
    title: "Одежда",
    image: "/clothing.png",
    url: "/categories/clothing",
    value: Category.CLOTHING
  },
  {
    title: "Книги",
    image: "/books.png",
    url: "/categories/books",
    value: Category.BOOKS
  },
]

export type ProductWithReviews = inferProcedureOutput<AppRouter["product"]["getMine"]>[number];

export function GetProductRating(product: ProductWithReviews) {
  return product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
}

export type Merchant = inferProcedureOutput<AppRouter["product"]["getMerchant"]>;

export function GetMerchantRating(merchant: Merchant) {
  return merchant.reviews.reduce((acc, review) => acc + review.rating, 0) / merchant.reviews.length
}

export const PRICE_PER_KM_RUB = 60;
export const PRICE_PER_KM_EXPRESS_RUB = 90;
