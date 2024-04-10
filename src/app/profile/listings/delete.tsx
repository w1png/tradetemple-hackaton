
"use client";

import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function DeleteListingDialog({ listing }: {
  listing: Product
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const deleteMutation = api.product.delete.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
      toast.toast({ title: "Объявление удалено" });
    },
    onError: (e) => {
      console.log(e)
      toast.toast({ title: "Не удалось удалить объявление", variant: "destructive" });
    }
  })

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-red-400"><FaTrash /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены что хотите удалить объявление?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены что хотите удалить объявление <br /><span className="break-all font-bold">"{listing?.name}"</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            if (listing) {
              deleteMutation.mutate({ id: listing.id })
            }
          }}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
