"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { GetMerchantRating, Merchant } from "~/shared";
import StarRating from "./star_rating";
import { useState } from "react";
import { Separator } from "./ui/separator";
import Image from "next/image";

export default function Reviews({
  merchant
}: {
  merchant: Merchant
}) {
  const [rating] = useState(GetMerchantRating(merchant))
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 w-fit h-fit text-sm">{merchant.reviews.length} оценок</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отзывы продавца</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-2 gap-4 w-full">
          <div className="flex flex-row gap-2">
            <p className="font-semibold text-3xl">{rating} / 5</p>
            <StarRating rating={rating} huge={true} />
          </div>
          <p>На основе {merchant.reviews.length} оценок</p>
          <Separator />
          {merchant.reviews.map((review) => (
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
      </DialogContent>
    </Dialog>
  );
}
