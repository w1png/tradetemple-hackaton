"use client"

import CartButton from "~/components/cart_button";
import { Separator } from "~/components/ui/separator";
import { CartListing } from "~/shared"

export default function CartListing({
  listing
}: {
  listing: CartListing
}) {
  console.log(listing)

  return (
    <>
      {listing.amount > 0 && (
        <div className="rounded-xl px-4 py-2 hover:shadow-xl transition-all ease-in-out duration-300 flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4">
            <div className="h-full rounded-md bg-red-400 aspect-square">
            </div>
            <div className="flex flex-col">
              <p className="text-xl font-semibold">{listing.product.name}</p>
              <p className="text-sm">{listing.product.price * listing.amount}₽</p>
            </div>
          </div>
          <CartButton listing_id={listing.productId} is_logged_in={true} />
        </div>
      )}
    </>
  );
}
