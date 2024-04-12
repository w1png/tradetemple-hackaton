"use client"

import { api } from "~/trpc/react";
import CartListing from "./cart_listing";
import { Skeleton } from "~/components/ui/skeleton";
import Link from "next/link";
import { Button } from "~/components/ui/button";

function CartListingSkeleton() {
  return (
    <Skeleton className="h-16 w-full rounded-xl" />
  );
}

export default function CartListings() {
  const listings = api.cart.getAll.useQuery();

  if (listings.isLoading && listings.isError) {
    return (
      <div className="flex flex-col gap-2 grow">
        {[...Array(5)].map((_, index) => <CartListingSkeleton key={index} />)}
      </div>
    )
  }

  if (listings.data?.length === 0) {
    return (
      <div className="grow w-full flex flex-col gap-4 items-center justify-center">
        <p className="text-5xl">Корзина пуста</p>
        <Link href="/">
          <Button>
            На главную
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 grow">
      {listings.data?.map((listing) => (
        <CartListing listing={listing} />
      ))}
    </div>
  );
}
