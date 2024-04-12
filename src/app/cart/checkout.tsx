"use client";

import { Select } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/components/ui/use-toast";
import { AvailableWarehouse, CartListing } from "~/shared";
import { api } from "~/trpc/react";

function PickupPointSelect({
  pickupPointId,
  setPickupPointId,
}: {
  pickupPointId: string | null,
  setPickupPointId: (value: string | null) => void
}) {
  const pickupPoints = api.pickupPoint.getAll.useQuery();

  if (!pickupPoints.data || pickupPoints.isLoading || pickupPoints.isError) {
    return <Skeleton className="h-10 w-full rounded-md" />
  }

  return (
    <Select onValueChange={(val) => setPickupPointId(val)}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите пункт выдачи" />
      </SelectTrigger>
      <SelectContent>
        {pickupPoints.data.map((pickupPoint) => (
          <SelectItem key={pickupPoint.id} value={pickupPoint.id}>
            {pickupPoint.adress}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function Checkout({
  totalSum,
  listings,
  warehouses
}: {
  totalSum: number,
  listings: CartListing[],
  warehouses: AvailableWarehouse[],
}) {
  const [open, setOpen] = useState(false);
  const [pickupPointId, setPickupPointId] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<"default" | "express">("default");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(0);
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const toast = useToast();

  const getRouteQuery = api.warehouse.getRoutes.useQuery({
    warehouseId: warehouses[0]?.id || "",
    pickupPointId: pickupPointId || "",
  }, {
    enabled: !!pickupPointId
  })

  const router = useRouter();

  const createOrderMutation = api.order.create.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.toast({ title: "Заказ оформлен" })
      setOpen(false);
      router.push("/profile/orders");
    },
    onError: (e) => {
      console.error(e)
      toast.toast({ title: "Не удалось оформить заказ" })
    },
  })

  const onSubmit = () => {
    if (pickupPointId === null) {
      toast.toast({ title: "Не выбран пункт выдачи" })
      return
    }

    if (deliveryType === "express" && getRouteQuery.data?.fastestRoute === null) {
      toast.toast({ title: "Не удалось найти маршрут" })
      return
    }

    createOrderMutation.mutate({
      pickupPointId: pickupPointId,
      warehouseId: warehouses[warehouses.length - 1]?.id!,
      deliveryType: deliveryType,
      deliveryPrice: deliveryPrice
    })
  }

  useEffect(() => {
    const r = deliveryType === "express" ? getRouteQuery.data?.fastestRoute : getRouteQuery.data?.bestRoute
    setDeliveryPrice(r?.price || 0)
    setDeliveryDistance((r?.distance || 0) * 10)
    setDeliveryTime(deliveryDistance / 15 * (deliveryType === "express" ? 0.7 : 1))
  }, [getRouteQuery, deliveryType])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={listings.length === 0}>Оформить заказ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Оформление заказа</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-2 gap-4">
          <p className="text-base font-semibold">Доставка</p>
          <PickupPointSelect pickupPointId={pickupPointId} setPickupPointId={setPickupPointId} />
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm">Тип доставки</p>
            <div className="flex flex-col gap-1 text-s">
              <RadioGroup defaultValue="default" onValueChange={(val) => setDeliveryType(val as "default" | "express")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">Обычная</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="r2" />
                  <Label htmlFor="r2">Экспресс</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm">Время доставки</p>
            <div className="flex flex-col gap-1 text-s">
              {deliveryTime.toFixed(0)} ч.
            </div>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm">Расстояние</p>
            <div className="flex flex-col gap-1 text-s">
              {deliveryDistance.toFixed(2)} км.
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <p className="text-base font-semibold">Ваш заказ</p>
            <div className="flex flex-row justify-between items-center">
              <p>Сумма заказа</p>
              <p>{totalSum}₽</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p>Доставка</p>
              <p>{deliveryPrice}₽</p>
            </div>
          </div>
          <Separator />
          <div className="flex flex-row items-center justify-between">
            <p className="text-base font-semibold">Итого</p>
            <p>{totalSum + deliveryPrice}₽</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={createOrderMutation.isPending}
            onClick={() => onSubmit()} type="submit">Оформить заказ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
