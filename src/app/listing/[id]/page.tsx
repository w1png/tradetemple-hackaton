import { $Enums } from "@prisma/client";
import CartButton from "~/components/cart_button";
import ImageSlider from "~/components/image_slider";
import MerchantCard from "~/components/merchant_card";
import NotFoundPage from "~/components/not-found";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { categories } from "~/shared";
import { api } from "~/trpc/server";

function getCategory(category: $Enums.Category) {
  return categories.find((c) => c.value === category)
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await api.product.getOne({ id: params.id });
  if (!listing || !listing.enabled) return <NotFoundPage />
  const category = getCategory(listing?.category)
  const merchant = await api.product.getMerchant({ id: listing?.id });

  return (
    <div className="container mx-auto space-y-4 mt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={category?.url}>{category?.title}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/listing/${listing.id}`}>{listing?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 md:grid-rows-1 md:gap-8 bg-white rounded-xl p-4 md:p-8">
        <ImageSlider images={listing.images} />
        <div className="flex flex-col rounded-xl w-full gap-4">
          <h1 className="text-xl mt-5 break-words text-wrap whitespace-normal">{listing?.name}</h1>
          <p className="text-2xl font-bold">{listing?.price}₽</p>
          <CartButton listing_id={listing.id} className="h-12 max-w-60" />
          <MerchantCard merchant={merchant} />
          <div className="gap-2 flex flex-col mt-6">
            <p className="font-bold text-xl">Описание</p>
            <p className="whitespace-pre-wrap break-words">{listing?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
