import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import CartListings from "./cart";
import { api } from "~/trpc/server";
import ClearCartButton from "./clear_cart_button";
import Checkout from "./checkout";
import CreateListing from "../profile/listings/create";

export default async function Cart() {
  const session = getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const totalSum = await api.cart.getTotalSum();
  const listings = await api.cart.getAll();
  const warehouses = await api.warehouse.getWithProducts({
    products: listings.map((listing) => {
      return {
        id: listing.productId,
        amount: listing.amount,
      }
    })
  });

  return (
    <div className="container flex flex-col mx-auto px-6 pt-6 rounded-xl bg-background">
      <CartListings />
      <div className="w-full flex flex-row items-center justify-between py-4 font-semibold text-xl border-t-2 border-gray-50 ">
        <Checkout listings={listings} warehouses={warehouses} totalSum={totalSum} />
        <div className="flex flex-col h-fit items-center">
          <p>Итого: {totalSum}₽</p>
          <ClearCartButton />
        </div>
      </div>
    </div>
  )
}
