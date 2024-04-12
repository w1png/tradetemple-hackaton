import { ScrollArea } from "~/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { api } from "~/trpc/server";
import UpdateOrder from "./update";
import { DeliveryType, OrderStatus } from "~/components/order";

export default async function MerchantOrdersPage() {
  const orders = await api.order.getOwnedMerchant()
  console.log(orders);

  return (
    <>
      <ScrollArea className="flex flex-col gap-2 mt-8 grow overflow-scroll w-full max-h-[calc(100svh-18rem)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Товаров</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Доставка</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              return (
                <TableRow key={order.id}>
                  <TableCell className="max-w-24 lg:max-w-48 truncate">{order.id}</TableCell>
                  <TableCell><OrderStatus status={order.status} /></TableCell>
                  <TableCell>{order.products.length}шт</TableCell>
                  <TableCell>{order.products.reduce((acc, product) => acc + product.price, 0)}₽</TableCell>
                  <TableCell><DeliveryType deliveryType={order.deliveryType} /></TableCell>
                  <TableCell>
                    <UpdateOrder order={order} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
