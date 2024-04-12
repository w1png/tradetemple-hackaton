"use client";

import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function CancelOrderButton({
  order_id
}: {
  order_id: string
}) {
  const toast = useToast();
  const router = useRouter()

  const cancelOrderMutation = api.order.cancelOrder.useMutation({
    onSuccess: () => {
      toast.toast({ title: "Заказ отменен" })
      router.refresh()
    },
    onError: () => {
      toast.toast({ title: "Не удалось отменить заказ", variant: "destructive" });
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive">Отменить</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены что хотите отменить заказ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Закрыть</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            cancelOrderMutation.mutate({
              orderId: order_id
            })
          }}>Отменить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

