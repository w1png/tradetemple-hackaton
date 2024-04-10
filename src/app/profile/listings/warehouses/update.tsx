
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import Loading from "~/components/loading";
import { useRouter } from "next/navigation";
import { RxPencil2 } from "react-icons/rx";
import { WarehouseWithPickupLocations, PikcupPoint, ProductWithWarehouseProductsAndReviews, ProductWithWarehouseProducts } from "~/shared";
import { Separator } from "~/components/ui/separator";

type Distance = {
  distance: number,
  time: number,
}

type ListingWithAmount = {
  listing: ProductWithWarehouseProductsAndReviews | null
  amount: number
}

export default function UpdateWarehouse({ warehouse, pickupPoints, listings }: {
  warehouse: WarehouseWithPickupLocations,
  pickupPoints: PikcupPoint[],
  listings: ProductWithWarehouseProducts[],
}) {
  const [open, setOpen] = useState<boolean>(false);

  const toast = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const [distances, setDistances] = useState<{ [key: string]: Distance }>({});
  const [amounts, setAmounts] = useState<ListingWithAmount[]>(listings.map((listing) => ({
    listing,
    amount: listing.warehouseProducts[0]?.amount || 0
  })));

  useEffect(() => {
    const new_distances: { [key: string]: Distance } = {}
    warehouse.warehouseToPickupPointDistance.forEach((val) => {
      new_distances[val.pickupPointId] = {
        distance: val.distanceKm,
        time: val.distanceMinutes
      }
    })
    setDistances(new_distances)

  }, [warehouse])

  const updateMutation = api.warehouse.update.useMutation({
    onSuccess: () => {
      utils.product.invalidate();
      toast.toast({ title: "Склад обновлен" });
      form.reset();
      router.refresh();
      setOpen(false);
    },
    onError: (e) => {
      console.error(e)
      toast.toast({ title: "Не удалось обновить склад", variant: "destructive" });
    },
  })
  const formSchema = z.object({
    adress: z
      .string({
        required_error: "Адрес обязателен",
        invalid_type_error: "Адрес должен быть строкой",
      })
      .min(1, "Адрес должен содержать хотя бы один символ")
      .max(80, "Адрес должен содержать максимум 80 символов"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      adress: warehouse.adress,
    },
    resolver: zodResolver(formSchema),
  });

  const onError = (errors: any) => {
    for (const key in errors) {
      if (errors[key]) {
        toast.toast({ title: errors[key].message, variant: "destructive" });
        break;
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    let wasError = false;
    pickupPoints.forEach((pickupPoint) => {
      const d = distances[pickupPoint.id]
      if (!d || d.time === 0 || d.distance === 0) {
        wasError = true
        return
      }
    })

    if (wasError) {
      toast.toast({ title: "Не все поля заполнены", variant: "destructive" });
      return
    }

    updateMutation.mutate({
      ...data,
      id: warehouse.id,
      amount: amounts
        .filter((amount) => amount.listing && amount.listing.id)
        .map((amount) => {
          return {
            listing_id: amount.listing!.id,
            amount: amount.amount
          }
        }),
      distances: pickupPoints.map((pickupPoint) => {
        if (!distances[pickupPoint.id]) {
          return {
            id: pickupPoint.id,
            time: 0,
            distance: 0
          }
        }
        return {
          id: pickupPoint.id,
          time: distances[pickupPoint.id]!.time,
          distance: distances[pickupPoint.id]!.distance
        }
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost"><RxPencil2 /></Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <DialogHeader>
              <DialogTitle className="pb-2">Редактирование склада</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70svh] px-4 overflow-scroll space-y-6">
              <div className="space-y-8 py-6">
                <FormField
                  control={form.control}
                  name="adress"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input placeholder="Кресло" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Separator />
                <div className="px-2 space-y-4 w-full flex flex-col">
                  {pickupPoints.map((point, index) => (
                    <div className="flex flex-col gap-2 w-full" key={index}>
                      <FormItem className="w-full">
                        <FormLabel
                        >Пукнт выдачи по адресу <span className="font-bold">"{point.adress}"</span></FormLabel>

                        <Input value={distances[point.id]?.distance || 0} placeholder="Расстояние (Километры)" type="number" onChange={(e) => setDistances({ ...distances, [point.id]: { distance: Number(e.target.value), time: distances[point.id]?.time || 0 } })} />
                        <Input value={distances[point.id]?.time || 0} placeholder="Время (Минуты)" type="number" onChange={(e) => setDistances({ ...distances, [point.id]: { distance: distances[point.id]?.distance || 0, time: Number(e.target.value) } })} />
                      </FormItem>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="w-full flex flex-col gap-2 px-2">
                  {listings.map((listing) => (
                    <FormItem>
                      <FormLabel>{listing.name}</FormLabel>
                      <Input
                        onChange={(e) => {
                          setAmounts(amounts.map((a) => a.listing?.id === listing.id ? { ...a, amount: Number(e.target.value) } : a))
                        }}
                        value={amounts.find((a) => a.listing?.id === listing.id)?.amount || 0}
                        placeholder="Количество"
                        type="number"
                      />
                    </FormItem>
                  ))}
                </div >
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
                {updateMutation.isPending && <Loading />}
                Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  );
}
