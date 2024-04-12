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
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { useState } from "react";
import Loading from "~/components/loading";
import { useRouter } from "next/navigation";

export default function CreateWarehouse() {
  const [open, setOpen] = useState<boolean>(false);

  const toast = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const createMutation = api.warehouse.create.useMutation({
    onSuccess: () => {
      utils.product.invalidate();
      toast.toast({ title: "Склад создан" });
      form.reset();
      router.refresh();
      setOpen(false);
    },
    onError: (e) => {
      console.error(e)
      toast.toast({ title: "Не удалось создать склад", variant: "destructive" });
    },
  })

  const formSchema = z.object({
    adress: z
      .string({
        required_error: "Адрес обязателен",
        invalid_type_error: "Адрес должен быть строкой",
      })
      .min(1, "Адрес должен содержать хотя бы один символ")
      .max(80, "Адрес должен содержать не более 80 символов"),
    coordX: z.coerce.number({
      required_error: "Координаты обязательны",
      invalid_type_error: "Координаты должны быть строкой",
    }),
    coordY: z.coerce.number({
      required_error: "Координаты обязательны",
      invalid_type_error: "Координаты должны быть строкой",
    })
  });

  const form = useForm<z.infer<typeof formSchema>>({
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
    createMutation.mutate({
      ...data,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">Содать склад</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <DialogHeader>
              <DialogTitle className="pb-8">Создание склада</DialogTitle>
            </DialogHeader>
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
            <FormItem className="px-2 py-4">
              <div className="grid grid-cols-2 gap-2 w-full">
                <FormField
                  control={form.control}
                  name="coordX"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Широта</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coordY"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Долгота</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </FormItem>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={createMutation.isPending} className="gap-2">
                {createMutation.isPending && <Loading />}
                Создать</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
