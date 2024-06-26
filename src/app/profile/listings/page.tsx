import { api } from "~/trpc/server";
import CreateListing from "./create";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { categories } from "~/shared";
import Image from "next/image";
import DeleteListingDialog from "./delete";
import UpdateListing from "./update";

export default async function Listings() {
  const listings = await api.product.getOwned();

  return (
    <>
      <ScrollArea className="flex flex-col gap-2 mt-8 grow overflow-scroll w-full max-h-[calc(100svh-18rem)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Фото</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="hidden md:table-cell">Цена</TableHead>
              <TableHead className="hidden md:table-cell">Категория</TableHead>
              <TableHead className="hidden lg:table-cell">Размер</TableHead>
              <TableHead className="hidden lg:table-cell">Вес</TableHead>
              <TableHead>На складе</TableHead>
              <TableHead className="hidden md:table-cell">Включен</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => {
              return (
                <TableRow key={listing.id}>
                  <TableCell>
                    <Image
                      width={100}
                      height={100}
                      className="size-12 md:size-16 rounded-xl object-cover"
                      alt={listing.name}
                      src={listing.images[0] || ""}
                      unoptimized
                    />
                  </TableCell>
                  <TableCell className="max-w-24 lg:max-w-48 truncate">{listing.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{listing.price}₽</TableCell>
                  <TableCell className="whitespace-nowrap max-w-36 truncate hidden md:table-cell">{categories.find((c) => c.value === listing.category)?.title}</TableCell>
                  <TableCell className="whitespace-nowrap hidden lg:table-cell">{listing.sizeX} x {listing.sizeY} x {listing.sizeZ}</TableCell>
                  <TableCell className="hidden lg:table-cell">{listing.weight}кг</TableCell>
                  <TableCell>{listing.warehouseProducts[0]?.amount}шт</TableCell>
                  <TableCell className="hidden md:table-cell">{listing.enabled ? <p className="text-in-stock">Включен</p> : <p className="text-not-in-stock" >Отключен</p>}</TableCell>
                  <TableCell>
                    <UpdateListing listing={listing} />
                    <DeleteListingDialog listing={listing} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="h-16 w-full flex items-center mb-14 md:mb-0">
        <CreateListing />
      </div>
    </>
  );
}
