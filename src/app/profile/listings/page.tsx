import { api } from "~/trpc/server";
import ListingCard from "~/components/listing_card";
import { ProfileTabsLayout } from "~/components/profile_tabs_layout";
import CreateListing from "./create";
import { ScrollArea } from "~/components/ui/scroll-area";

export default async function Listings() {
  const listings = await api.product.getMine();

  if (listings[0]) {
    listings[0].name += "dfcgvhbjknbhgvfcdxgvhbjknbhgvfcvhbjknhbgvfcdxgvhjkngytfvcdx"
  }

  return (
    <div className="max-h-[calc(100svh-7rem)] w-full flex">
      <ProfileTabsLayout
        tabs={[
          {
            name: "Статистика",
            href: "/profile/listings/stats"
          },
          {
            name: "Объявления",
            href: "/profile/listings"
          },
          {
            name: "Заказы",
            href: "/profile/listings/orders"
          },
          {
            name: "Завершенные",
            href: "/profile/listings/completed"
          }
        ]}
      >
        <ScrollArea className="flex flex-col gap-2 mt-8 grow overflow-scroll max-h-[calc(100svh-18rem)]">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <ListingCard listing={listing} />
            ))}
          </div>
        </ScrollArea>
        <div className="h-16 w-full flex items-center">
          <CreateListing />
        </div>
      </ProfileTabsLayout>
    </div>
  );
}
