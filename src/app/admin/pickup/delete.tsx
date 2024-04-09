"use client";

import { PickupPoint } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function DeleteDialog({ pickupPoint }: {
  pickupPoint: PickupPoint | null
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const deleteMutation = api.pickupPoint.delete.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
      toast.toast({ title: "Пункт выдачи удален" });
    },
    onError: (e) => {
      console.log(e)
      toast.toast({ title: "Не удалось удалить пункт выдачи", variant: "destructive" });
    }
  })

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Удалить</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены что хотите удалить пункт выдачи?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены что хотите удалить пункт выдачи по адресу <br /><span className="font-bold">"{pickupPoint?.adress}"</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            if (pickupPoint) {
              deleteMutation.mutate({ id: pickupPoint.id })
            }
          }}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
