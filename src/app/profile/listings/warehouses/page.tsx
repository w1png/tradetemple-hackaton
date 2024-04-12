import { ScrollArea } from "~/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { api } from "~/trpc/server";
import CreateWarehouse from "./create";
import DeleteWarehouseDialog from "./delete";
import UpdateWarehouse from "./update";

export default async function Warehouses() {
  const warehouses = await api.warehouse.getOwned();
  const pickupPoints = await api.warehouse.getPickupPoints();
  const listings = await api.product.getOwnedWithWarehouseProducts();

  return (
    <>
      <ScrollArea className="flex flex-col gap-2 mt-8 grow overflow-scroll w-full max-h-[calc(100svh-18rem)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Адрес</TableHead>
              <TableHead className="w-24 whitespace-nowrap">Товаров на складе</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((warehouse) => {
              return (
                <TableRow key={warehouse.id}>
                  <TableCell className="truncate whitespace-nowrap">{warehouse.adress}</TableCell>
                  <TableCell className="hidden md:table-cell">{warehouse.totalProducts}</TableCell>
                  <TableCell className="flex flex-row">
                    <UpdateWarehouse listings={listings} warehouse={warehouse} />
                    <DeleteWarehouseDialog warehouse={warehouse} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="h-16 w-full flex items-center mb-12 md:m-0">
        <CreateWarehouse />
      </div>

    </>
  );
}
