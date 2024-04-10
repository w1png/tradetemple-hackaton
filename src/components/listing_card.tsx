import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import StarRating from "./star_rating";
import { GetProductRating, ProductWithWarehouseProductsAndReviews } from "~/shared";
import Link from "next/link";

export default function ListingCard({ listing }: { listing: ProductWithWarehouseProductsAndReviews }) {
  return (
    <Link href={`/listing/${listing.id}`} className="p-4 rounded-xl w-full bg-background border-border hover:shadow-xl flex flex-col gap-2 transition-all ease-in-out duration-300">
      <div className="w-full aspect-square">
        {listing.images[0] ? (
          <Image width={100} height={100} src={listing.images[0]} unoptimized placeholder="empty" alt={listing.name} className="w-full h-full rounded-xl object-cover" />
        ) : (
          <Skeleton className="w-full h-full rounded-xl" />
        )}
      </div>
      {listing.enabled ? (
        <p className="text-in-stock">Есть на складе</p>
      ) : (
        <p className="text-out-of-stock">Нет на складе</p>
      )}
      <p className="font-bold text-xl">{listing.price}₽</p>
      <p className="w-full truncate">{listing.name}</p>
      <div className="flex flex-row gap-2 items-center">
        <StarRating rating={GetProductRating(listing)} />
        <p className="text-sm text-foreground/60">{listing.reviews.length}</p>
      </div>
    </Link>
  );
}
