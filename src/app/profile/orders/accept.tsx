
"use client";

import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function AcceptOrderButton({
  order_id
}: {
  order_id: string
}) {
  const toast = useToast();
  const router = useRouter()

  const acceptOrderMutation = api.order.acceptOrder.useMutation({
    onSuccess: () => {
      toast.toast({ title: "Заказ принят" })
      router.refresh()
    },
    onError: () => {
      toast.toast({ title: "Не удалось принять заказ", variant: "destructive" });
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button>Принять</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены что хотите принять от заказа?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Закрыть</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            acceptOrderMutation.mutate({
              orderId: order_id
            })
          }}>Принять</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

