"use client";

import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { api } from "~/trpc/react";
import { Skeleton } from "./ui/skeleton";

interface CartButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  listing_id: string,
  is_logged_in: boolean
}

const CartButton = ({ listing_id, is_logged_in, ...props }: CartButtonProps) => {
  const utils = api.useUtils();
  const increment = api.cart.increment.useMutation({
    onSuccess: () => {
      utils.cart.getOne.invalidate({ product_id: listing_id })
      utils.cart.getAll.invalidate()
      utils.cart.getCount.invalidate()
    }
  })

  const cart_product = api.cart.getOne.useQuery({
    product_id: listing_id
  })

  if (!is_logged_in) {
    return (
      <Button onClick={() => {
        redirect("/api/auth/signin")
      }} {...props}>Добавить в корзину</Button>
    )
  }

  if (cart_product.isLoading || cart_product.isError) {
    return (
      <Skeleton className={props.className} />
    )
  }

  if (!cart_product.data || cart_product.data.amount === 0) {
    return (
      <Button onClick={() => {
        increment.mutate({ product_id: listing_id, increment: 1 })
      }} {...props}>Добавить в корзину</Button>
    )
  }

  return (
    <div className={"flex flex-row gap-2" + props.className}>
      <Button
        className="size-10"
        onClick={() => {
          increment.mutate({ product_id: listing_id, increment: -1 })
        }}
      >-</Button>
      <p className="h-10 w-14 flex items-center justify-center">{cart_product.data.amount}</p>
      <Button
        className="size-10"
        onClick={() => {
          increment.mutate({ product_id: listing_id, increment: 1 })
        }}
      >+</Button>
    </div>
  )
}

export default CartButton;
