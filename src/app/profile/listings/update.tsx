
"use client";

import { Category } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Base64ToFile, ImagesToBase64, categories } from "~/shared";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import Loading from "~/components/loading";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import { RxPencil2 } from "react-icons/rx";
import ImageUpload from "./upload_images";
import { Switch } from "~/components/ui/switch";

export default function UpdateListing({ listing }: {
  listing: Product
}) {
  const [open, setOpen] = useState<boolean>(false);

  const toast = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    const images = Promise.all(
      listing.images.map((image) => {
        return Base64ToFile(image)
      })
    )

    images.then((images) => {
      setImageFiles(images)
    })
  }, [listing])

  const updateMutation = api.product.update.useMutation({
    onSuccess: () => {
      utils.product.invalidate();
      toast.toast({ title: "Объявление обновлено" });
      form.reset();
      router.refresh();
      setOpen(false);
    },
    onError: (e) => {
      console.error(e)
      toast.toast({ title: "Не удалось обновить объявление", variant: "destructive" });
    },
  })

  const formSchema = z.object({
    name: z
      .string({
        required_error: "Название обязательно",
        invalid_type_error: "Название должно быть строкой",
      })
      .min(1, "Имя должно содержать хотя бы один символ")
      .max(20, "Имя должно содержать не более 20 символов"),
    price: z.coerce.number({
      required_error: "Цена обязательна",
      invalid_type_error: "Цена должна быть числом",
    }).min(1),
    category: z.nativeEnum(Category, {
      required_error: "Категория обязательна"
    }),
    sizeX: z.coerce.number({
      required_error: "Ширина обязательна",
      invalid_type_error: "Ширина должна быть числом",
    }).min(1),
    sizeY: z.coerce.number({
      required_error: "Высота обязательна",
      invalid_type_error: "Высота должна быть числом",
    }).min(1),
    sizeZ: z.coerce.number({
      required_error: "Глубина обязательна",
      invalid_type_error: "Глубина должна быть числом",
    }).min(1),
    weight: z.coerce.number({
      required_error: "Вес обязателен",
      invalid_type_error: "Вес должен быть числом",
    }).min(1),

    description: z
      .string({
        required_error: "Описание обязательно",
      })
      .min(1, "Описание должно содержать хотя бы один символ"),
    enabled: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: listing.name,
      price: listing.price,
      category: listing.category,
      sizeX: listing.sizeX,
      sizeY: listing.sizeY,
      sizeZ: listing.sizeZ,
      weight: listing.weight,
      description: listing.description,
      enabled: listing.enabled
    },
    resolver: zodResolver(formSchema),
  });

  const onError = (errors: any) => {
    for (const key in errors) {
      if (errors[key]) {
        toast.toast({ title: errors[key].message, variant: "destructive" });
        break;
      }
    }
  };

  const [imagesLoading, setImagesLoading] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (imageFiles.length === 0) {
      toast.toast({ title: "Добавьте хотя бы одну картинку", variant: "destructive" });
      return
    }

    if (imageFiles.length > 3) {
      toast.toast({ title: "Максимальное количество изображений - 3", variant: "destructive" });
      return
    }

    setImagesLoading(true);
    const images = await ImagesToBase64(imageFiles);
    updateMutation.mutate({
      ...data,
      id: listing.id,
      images: images
    });
    setImagesLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost"><RxPencil2 /></Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <DialogHeader>
              <DialogTitle className="pb-2">Редактирование объявления</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70svh] px-4 overflow-scroll space-y-6">
              <div className="space-y-4 py-6">
                <ImageUpload imageFiles={imageFiles} setImageFiles={setImageFiles} />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input placeholder="Кресло" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Категория</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Категория..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value} >
                                {category.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Цена</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormItem className="px-2">
                  <div className="flex flex-row items-center gap-2">
                    <FormField
                      control={form.control}
                      name="sizeX"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Длина</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <p className="mt-8 select-none">x</p>
                    <FormField
                      control={form.control}
                      name="sizeY"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ширина</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <p className="mt-8 select-none">x</p>
                    <FormField
                      control={form.control}
                      name="sizeZ"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Высота</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormDescription>
                    Размер товара указывается в сантиметрах
                  </FormDescription>
                </FormItem>
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Вес</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10" {...field} />
                      </FormControl>
                      <FormDescription>
                        Вес товара указывается в килограммах
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none h-32"
                          placeholder="Товары только лучшего качества..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormControl>
                        <div className="flex flex-row items-center gap-2">
                          <p>Включено</p>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={updateMutation.isPending || imagesLoading} className="gap-2">
                {updateMutation.isPending || imagesLoading && <Loading />}
                Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
