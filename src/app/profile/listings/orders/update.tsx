"use client";

import { $Enums } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RxPencil2 } from "react-icons/rx";
import { DeliveryType, OrderStatus } from "~/components/order";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableRow } from "~/components/ui/table";
import { useToast } from "~/components/ui/use-toast";
import { MerchantOrder } from "~/shared";
import { api } from "~/trpc/react";

export default function UpdateOrder({ order }: {
  order: MerchantOrder
}) {
  const [open, setOpen] = useState(false);

  const [isOrderStatusUnmutable, setIsOrderStatusUnmutable] = useState(["CANCELLED", "DELIVERED", "RECEIVED"].includes(order.status))
  const [orderStatus, setOrderStatus] = useState(order.status)
  const statuses = useMemo(() => {
    return Object.keys($Enums.OrderStatus)
  }, [])

  const toast = useToast();
  const router = useRouter();

  const updateOrderMutation = api.order.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.toast({ title: "Статус заказа обновлен" })
      setOpen(false)
      router.refresh()
    },
    onError: (e) => {
      console.log(e)
      toast.toast({ title: "Не удалось обновить статус заказа", variant: "destructive" });
    }
  })

  useEffect(() => {
    setIsOrderStatusUnmutable(["CANCELLED", "REJECTED", "RECEIVED"].includes(order.status))
  }, [order])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost"><RxPencil2 /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Информация о заказе</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-2 gap-6">
          <div className="flex flex-col gap-2">
            <Select
              disabled={isOrderStatusUnmutable}
              value={orderStatus}
              onValueChange={(value) => setOrderStatus(value as $Enums.OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((key) => (
                  <SelectItem key={key} value={key}>
                    <OrderStatus status={key as $Enums.OrderStatus} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-row w-full justify-between">
              <p className="text-sm">Тип доставки</p>
              <DeliveryType deliveryType={order.deliveryType} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Маршрут</p>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <div className="rounded-full h-full aspect-square bg-primary/80"></div>
                <p>Склад ({order.warehouse?.adress})</p>
              </div>
              <div className="ml-2.5 h-14 w-1 bg-primary/80"></div>
              <div className="flex flex-row gap-2">
                <div className="rounded-full h-full aspect-square bg-primary/80"></div>
                <p className="truncate">Пункт выдачи ({order.warehouse?.adress})</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Товары</p>
            <Table>
              <TableRow className="bg-muted">
                <TableHead>Товар</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Цена</TableHead>
              </TableRow>
              <TableBody>
                {order.products.map((product) => (
                  <TableRow>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.amount}</TableCell>
                    <TableCell>{product.price * product.amount}₽</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => updateOrderMutation.mutate({ orderId: order.id, status: orderStatus })}
          >Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  );
}
