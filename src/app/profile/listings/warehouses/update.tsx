
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
import { useState } from "react";
import Loading from "~/components/loading";
import { useRouter } from "next/navigation";
import { RxPencil2 } from "react-icons/rx";
import { ProductWithWarehouseProductsAndReviews, ProductWithWarehouseProducts, WarehouseWithProducts } from "~/shared";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import Image from "next/image";

type ListingWithAmount = {
  listing: ProductWithWarehouseProductsAndReviews | null
  amount: number
}

export default function UpdateWarehouse({ warehouse, listings }: {
  warehouse: WarehouseWithProducts,
  listings: ProductWithWarehouseProducts[],
}) {
  const [open, setOpen] = useState<boolean>(false);

  const toast = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const [amounts, setAmounts] = useState<ListingWithAmount[]>(listings.map((listing) => ({
    listing,
    amount: listing.warehouseProducts[0]?.amount || 0
  })));

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
    coordX: z.coerce.number({
      required_error: "Широта обязательна",
      invalid_type_error: "Широта должна быть числом",
    }),
    coordY: z.coerce.number({
      required_error: "Долгота обязательна",
      invalid_type_error: "Долгота должна быть числом",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      adress: warehouse.adress,
      coordY: warehouse.coordY,
      coordX: warehouse.coordX,
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
            amount: amount.amount,
          }
        }),
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
              <div className="space-y-2 py-6">
                <FormField
                  control={form.control}
                  name="adress"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Адрес</FormLabel>
                      <FormControl>
                        <Input placeholder="г. Москва ул. Ленина д. 25" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coordX"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Ширина</FormLabel>
                      <FormControl>
                        <Input placeholder="10" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coordY"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Высота</FormLabel>
                      <FormControl>
                        <Input placeholder="10" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="w-full flex flex-col gap-2 py-6 px-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Фото</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead>Кол-во</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.map((listing) => {
                        return (
                          <TableRow>
                            <TableCell className="w-fit">
                              <Image
                                width={100}
                                height={100}
                                className="size-12 aspect-square md:size-16 rounded-xl object-cover"
                                src={listing.images[0] || ""}
                                alt={listing.name}
                              />

                            </TableCell>
                            <TableCell className="max-w-36 truncate">{listing.name}</TableCell>
                            <TableCell>
                              <Input
                                className="max-w-24"
                                onChange={(e) => {
                                  const amount = parseInt(e.target.value);
                                  setAmounts((prev) => {
                                    return prev.map((a) => {
                                      if (a.listing?.id === listing.id) {
                                        return {
                                          ...a,
                                          amount
                                        }
                                      }
                                      return a
                                    })
                                  })
                                }}
                                value={amounts.find((a) => a.listing?.id === listing.id)?.amount || 0}
                                type="number" placeholder="0" />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
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
