"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "~/components/loading";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function CreatePickupPoint() {
  const toast = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const formSchema = z.object({
    adress: z.string()
      .min(1, "Адрес должен содержать хотя бы один символ"),
    schedule: z.string().min(1, "Расписание должно содержать хотя бы один символ"),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      adress: "",
      schedule: "",
    },
    resolver: zodResolver(formSchema)
  })

  const createMutation = api.pickupPoint.create.useMutation({
    onSuccess: () => {
      toast.toast({ title: "Пукнт выдачи создан" });
      utils.pickupPoint.invalidate();
      router.refresh();
      form.reset();
    },
    onError: (e) => {
      console.log(e)
      toast.toast({ title: "Не удалось создать объявление", variant: "destructive" });
    }
  })


  const onError = (errors: any) => {
    for (const key in errors) {
      if (errors[key]) {
        toast.toast({ title: errors[key].message, variant: "destructive" });
        break;
      }
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit, onError)}>
        <FormField
          control={form.control}
          name="adress"
          render={({ field }) => (
            <FormItem className="px-2">
              <FormLabel>Адрес</FormLabel>
              <FormControl>
                <Input type="text" placeholder="г. Москва ул. Ленина д. 5" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem className="px-2">
              <FormLabel>Расписание</FormLabel>
              <FormControl>
                <Input type="text" placeholder="пн-пт: 10:00-18:00" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Button type="submit" disabled={createMutation.isPending} className="gap-2">
            {createMutation.isPending && <Loading />}
            Создать</Button>
        </div>
      </form>
    </Form>
  );
}
