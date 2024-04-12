"use client";

import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function RepeatOrderButton({
  order_id
}: {
  order_id: string
}) {
  const toast = useToast();
  const router = useRouter()

  const repeatOrderMutation = api.order.repeatOrder.useMutation({
    onSuccess: () => {
      toast.toast({ title: "Заказ создан" })
      router.refresh()
    },
    onError: () => {
      toast.toast({ title: "Не удалось повторить заказ", variant: "destructive" });
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost">Повторить заказ</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены что хотите повторить заказ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Закрыть</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            repeatOrderMutation.mutate({
              orderId: order_id
            })
          }}>Повторить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

