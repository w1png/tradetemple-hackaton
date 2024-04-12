"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function ClearCartButton() {
  const toast = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const clearCartMutation = api.cart.clearCart.useMutation({
    onSuccess: () => {
      toast.toast({ title: "Корзина очищена" })
      utils.cart.getAll.invalidate();
      utils.cart.getCount.invalidate();
      utils.cart.getTotalSum.invalidate();
      utils.cart.invalidate();
      router.refresh();
    },
    onError: () => {
      toast.toast({ title: "Не удалось очистить корзину", variant: "destructive" });
    },
  });

  return (
    <Button
      onClick={() => {
        clearCartMutation.mutate();
      }}
      variant="ghost" className="px-2 py-1 w-fit h-fit"
    >
      Очистить корзину
    </Button>
  );
} 
