"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { UserOrder } from "~/shared";
import { api } from "~/trpc/react";

function Star({ isActive, onClick, onHover, onHoverEnd }: {
  isActive: boolean,
  onClick: () => void,
  onHover: () => void,
  onHoverEnd: () => void
}) {
  const cl = "size-8";

  if (!isActive) {
    return <FaRegStar onClick={onClick} onMouseOver={onHover} onMouseLeave={onHoverEnd} className={`text-foreground/30 cursor-pointer ${cl}`} />;
  }

  return <FaStar onClick={onClick} onMouseOver={onHover} onMouseLeave={onHoverEnd} className={`text-star cursor-pointer ${cl}`} />;
}


export default function ReviewDialog({
  order
}: {
  order: UserOrder
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [comment, setComment] = useState("");

  const toast = useToast()
  const router = useRouter();

  const createCommentMutation = api.review.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setOpen(false);
      toast.toast({ title: "Отзыв создан" })
    },
    onError: () => {
      toast.toast({ title: "Не удалось оставить отзыв", variant: "destructive" });
    }
  })

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string,
    name: string
  } | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Оценить товары</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Оставить отзыв</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          {selectedProduct ? (
            <>
              <p>{selectedProduct.name}</p>
              <div className="flex flex-row">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    isActive={rating >= index + 1 || hoverRating >= index + 1}
                    onClick={() => setRating(index + 1)}
                    onHover={() => setHoverRating(index + 1)}
                    onHoverEnd={() => setHoverRating(0)}
                  />
                ))}
              </div>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-48 resize-none" placeholder="Комментарий к оценке" />
            </>
          ) : (
            <>
              {order.products.map((product) => (
                <div onClick={() => setSelectedProduct({
                  productId: product.productId,
                  name: product.name,
                })} className="h-16 transition-all ease-in-out duration-300 w-full flex flex-row justify-between items-center px-4 rounded-xl hover:shadow-xl">
                  <p>{product.name}</p>
                  <Button className="rounded-full" variant="secondary">Оценить</Button>
                </div>
              ))}
            </>
          )}
        </div>
        {selectedProduct && (
          <DialogFooter>
            <Button onClick={() => {
              createCommentMutation.mutate({
                productId: selectedProduct.productId,
                rating,
                comment
              })
            }}>Отправить</Button>
          </DialogFooter>
        )}
      </DialogContent>

    </Dialog>
  );
}
