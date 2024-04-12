import { $Enums } from "@prisma/client";
import CartButton from "~/components/cart_button";
import ImageSlider from "~/components/image_slider";
import MerchantCard from "~/components/merchant_card";
import NotFoundPage from "~/components/not-found";
import StarRating from "~/components/star_rating";
import { Separator } from "~/components/ui/separator";
import { getServerAuthSession } from "~/server/auth";
import { GetListingRating, categories } from "~/shared";
import { api } from "~/trpc/server";
import Image from "next/image";

function getCategory(category: $Enums.Category) {
  return categories.find((c) => c.value === category)
}

function ListingFeatures({
  name,
  value
}: {
  name: string,
  value: string
}) {
  return (
    <div className="flex flex-row items-center gap-4">
      <p>{name}</p>
      <div className="grow border-dashed border-t-2 h-[1px]">
      </div>
      <p>{value}</p>
    </div>
  );
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await api.product.getOne({ id: params.id });
  if (!listing || !listing.enabled) return <NotFoundPage />
  const category = getCategory(listing?.category)
  const merchant = await api.product.getMerchant({ id: listing?.id });
  const session = getServerAuthSession();

  return (
    <div className="container mx-auto space-y-4 mt-4 bg-background rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 md:grid-rows-1 md:gap-8 p-4 md:p-8">
        <ImageSlider images={listing.images} />
        <div className="flex flex-col rounded-xl w-full gap-4">
          <h1 className="text-xl mt-5 break-words text-wrap whitespace-normal">{listing?.name}</h1>
          <p className="text-2xl font-bold">{listing?.price}₽</p>
          <CartButton is_logged_in={!!session} listing_id={listing.id} className="h-12 max-w-60" />
          <MerchantCard merchant={merchant} />
          <div className="flex flex-col pt-4">
            <ListingFeatures name="Вес" value={listing.weight + "кг"} />
            <ListingFeatures name="Длина" value={listing.sizeX.toString() + "см"} />
            <ListingFeatures name="Ширина" value={listing.sizeY.toString() + "см"} />
            <ListingFeatures name="Высота" value={listing.sizeZ.toString() + "см"} />
          </div>

        </div>
        <div className="col-span-2 flex flex-col mt-2 w-full">
          <p className="font-bold text-xl">Описание</p>
          <p className="whitespace-pre-wrap break-words w-full">{listing?.description}</p>
        </div>
      </div>
      <div className="flex flex-col px-2 gap-4 w-full py-4">
        <div className="flex flex-row gap-2">
          <p className="font-semibold text-3xl">{GetListingRating(listing) || 0} / 5</p>
          <StarRating rating={GetListingRating(listing)} huge={true} />
        </div>
        <p>На основе {listing.reviews.length} оценок</p>
        <Separator />
        {listing.reviews.map((review) => (
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-row w-full justify-between items-center">
                <div className="flex flex-row gap-2">
                  <Image
                    width={50}
                    height={50}
                    src={review.User?.image || ""}
                    alt={review.User?.name || ""}
                    unoptimized
                    className="size-6 rounded-full"
                  />
                  {review.User?.name}
                </div>
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
    </div>
  );
}
