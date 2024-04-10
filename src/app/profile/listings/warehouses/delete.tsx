
"use client";

import { inferProcedureOutput } from "@trpc/server";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function DeleteWarehouseDialog({ warehouse }: {
  warehouse: { id: string, adress: string }
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const deleteMutation = api.warehouse.delete.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
      toast.toast({ title: "Склад удален" });
    },
    onError: (e) => {
      console.log(e)
      toast.toast({ title: "Не удалось удалить склад", variant: "destructive" });
    }
  })

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-red-400"><FaTrash /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены что хотите удалить склад?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены что хотите удалить склад по адресу <br /><span className="break-all font-bold">"{warehouse?.adress}"</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            if (warehouse) {
              deleteMutation.mutate({ id: warehouse.id })
            }
          }}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
