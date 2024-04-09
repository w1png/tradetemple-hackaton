"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

export default function EditProfile({ name }: { name: string }) {
  const toast = useToast();

  const editUser = api.user.update.useMutation({
    onError: (e) => {
      console.log(e)
      toast.toast({ title: "Не удалось обновить имя", variant: "destructive" });
    },
    onSuccess: () => {
      toast.toast({ title: "Имя обновлено" });
    },
  })

  const formSchema = z.object({
    name: z
      .string()
      .min(1, "Имя должно содержать хотя бы один символ")
      .max(60, "Имя должно содержать не более 20 символов"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: name,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
    editUser.mutate(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-x-4 w-full flex items-center">
      <Input
        className="w-full"
        placeholder="Имя"
        {...form.register("name")}
      />
      <Button type="submit">Сохранить</Button>
    </form>
  );
}
