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
  // Split the base64 string into parts
  const parts = base64.split(';base64,');

  if (parts.length !== 2) {
    throw new Error('Invalid base64 string');
  }

  // Extract the content type and base64 data
  const contentType = parts[0]!.split(':')[1];
  const base64Data = parts[1];

  // Convert base64 to blob
  const byteCharacters = atob(base64Data!);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });

  // Create a File object from the blob
  const file = new File([blob], `file.${contentType!.split('/')[1]}`, { type: contentType });

  return file;
}
