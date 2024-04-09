import Link from "next/link";
import { GetMerchantRating, Merchant } from "~/shared";
import StarRating from "./star_rating";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";


export default function MerchantCard({ merchant }: {
  merchant: Merchant | null
}) {
  if (!merchant) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 w-full md:max-w-60">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-1">
          <Link className="url" href={`/merchant/${merchant.id}`}>{merchant.name}</Link>
          <div className="flex flex-row gap-2">
            <StarRating rating={GetMerchantRating(merchant)} />
            <Link className="url text-sm" href={`/merchant/${merchant.id}/reviews`}>{merchant.reviews.length} оценок</Link>
          </div>
        </div>
        <Link href={`/merchant/${merchant.id}`} className="h-full aspect-square flex items-center justify-center">
          <Avatar>
            <AvatarImage src={merchant.avatar || ""} className="w-full h-full" />
            <AvatarFallback>
              <Skeleton className="h-full w-full rounded-full" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <p className="text-foreground/60 text-sm">Зарегистрирован {merchant.created_at.toLocaleDateString("ru")}</p>
    </div>
  )

}
