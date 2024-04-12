import { type inferProcedureOutput } from "@trpc/server";
import { Category } from "@prisma/client";
import { AppRouter } from "./server/api/root";

export const categories = [
  {
    id: "electronics",
    title: "Электроника",
    image: "/electronics.jpg",
    url: "/categories/electronics",
    value: Category.ELECTRONICS,
  },
  {
    id: "house",
    title: "Для дачи и дома",
    image: "/house.jpg",
    url: "/categories/house",
    value: Category.HOME,
  },
  {
    id: "hobby",
    title: "Товары для хобби и отдыха",
    image: "/hobby.jpg",
    url: "/categories/hobby",
    value: Category.HOBBY,
  },
  {
    id: "pets",
    title: "Животные и товары для них",
    image: "/pets.jpg",
    url: "/categories/pets",
    value: Category.PETS
  },
  {
    id: "clothing",
    title: "Одежда",
    image: "/clothing.jpg",
    url: "/categories/clothing",
    value: Category.CLOTHING
  },
  {
    id: "books",
    title: "Книги",
    image: "/books.jpg",
    url: "/categories/books",
    value: Category.BOOKS
  },
]

export type ProductWithWarehouseProducts = inferProcedureOutput<AppRouter["product"]["getOwnedWithWarehouseProducts"]>[number];
export type ProductWithReviews = inferProcedureOutput<AppRouter["product"]["getByCategory"]>[number];
export type ProductWithWarehouseProductsAndReviews = inferProcedureOutput<AppRouter["product"]["getOwned"]>[number];

export function GetProductRating(product: ProductWithWarehouseProductsAndReviews | ProductWithReviews) {
  return product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
}

export type Merchant = inferProcedureOutput<AppRouter["product"]["getMerchant"]>;

export function GetMerchantRating(merchant: Merchant) {
  return merchant.reviews.reduce((acc, review) => acc + review.rating, 0) / merchant.reviews.length
}

export function GetListingRating(listing: ProductWithReviews) {
  return listing.reviews.reduce((acc, review) => acc + review.rating, 0) / listing.reviews.length
}

export const PRICE_PER_KM_RUB = 20;
export const PRICE_PER_KM_EXPRESS_RUB = 40;

export async function ImagesToBase64(images: File[]): Promise<string[]> {
  const imagesBase64 = await Promise.all(
    images.map(async (image) => {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      return base64;
    })
  );
  return imagesBase64 as string[];
}

export async function Base64ToFile(base64: string): Promise<File> {
  const parts = base64.split(';base64,');

  if (parts.length !== 2) {
    throw new Error('Invalid base64 string');
  }

  const contentType = parts[0]!.split(':')[1];
  const base64Data = parts[1];

  const byteCharacters = atob(base64Data!);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });

  const file = new File([blob], `file.${contentType!.split('/')[1]}`, { type: contentType });

  return file;
}

export type WarehouseWithProducts = inferProcedureOutput<AppRouter["warehouse"]["getOwned"]>[number];
export type PikcupPoint = inferProcedureOutput<AppRouter["warehouse"]["getPickupPoints"]>[number];

export type CartListing = inferProcedureOutput<AppRouter["cart"]["getAll"]>[number];
export type AvailableWarehouse = inferProcedureOutput<AppRouter["warehouse"]["getWithProducts"]>[number];


export type MerchantOrder = inferProcedureOutput<AppRouter["order"]["getOwnedMerchant"]>[number];
export type UserOrder = inferProcedureOutput<AppRouter["order"]["getOwned"]>[number];
