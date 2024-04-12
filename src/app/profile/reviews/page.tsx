import { api } from "~/trpc/server";
import Image from "next/image";
import StarRating from "~/components/star_rating";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Reviews() {
  const reviews = await api.review.getOwned();

  return (
    <div className="flex flex-col w-full overflow-y-scroll h-full bg-background rounded-xl p-6 gap-4">
      {reviews.map((review) => (
        <div className="flex flex-row w-full justify-between">
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-row w-full justify-between items-center">
              <Link href={`/listing/${review.product?.id}`} className="flex flex-row gap-2">
                <Image
                  width={50}
                  height={50}
                  src={review.product?.images[0] || ""}
                  alt={review.product?.name || ""}
                  unoptimized
                  className="size-10 rounded-full object-cover"
                />
                <Button variant="link">{review.product?.name}</Button>
              </Link>
              <StarRating rating={review.rating} />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Комментарий</p>
              <p className="text-sm">{review.body}</p>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}
