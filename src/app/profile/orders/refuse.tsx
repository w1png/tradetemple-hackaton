"use client";

import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function RejectOrderButton({
  order_id
}: {
  order_id: string
}) {
  const toast = useToast();
  const router = useRouter()

  const rejectOrderMutation = api.order.rejectOrder.useMutation({
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
        <Button variant="destructive">Отказаться</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены что хотите отказаться от заказа?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Закрыть</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            rejectOrderMutation.mutate({
              orderId: order_id
            })
          }}>Отменить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

