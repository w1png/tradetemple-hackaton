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
import { categories } from "~/shared";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";
import { FaTrash } from "react-icons/fa";
import Loading from "~/components/loading";
import { useRouter } from "next/navigation";

function ImageUpload({
  imageFiles,
  setImageFiles,
}: {
  imageFiles: File[],
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>,
}) {
  const toast = useToast();

  return (
    <div className="flex flex-col px-2 space-y-2">
      <div className="grid grid-cols-3 gap-4">
        {imageFiles.length == 0 && (
          Array.from({ length: 3 }).map((_, index) => (
            <div className="w-full aspect-square">
              <Skeleton
                key={index}
                className="aspect-square w-full"
              />
            </div>
          ))
        )}
        {imageFiles.map((file, index) => (
          <div className="grid grid-cols-1 grid-rows-1 w-full group">
            <Image
              key={index}
              src={URL.createObjectURL(file)}
              alt="Uploaded image"
              width={100}
              height={100}
              className="w-full aspect-square object-cover rounded-xl col-span-1 row-span-1 col-start-1 row-start-1"
            />
            <button
              type="button"
              onClick={() => {
                setImageFiles(imageFiles.filter((_, i) => i !== index));
              }}
              className="text-white group-hover:opacity-100 opacity-0 bg-black/50 transition-opacity ease-in-out duration-300 p-2 flex justify-end z-10 w-full aspect-square object-cover rounded-xl col-span-1 row-span-1 col-start-1 row-start-1">
              <FaTrash className="size-3" />
            </button>
          </div>
        ))}
      </div>
      <label>
        <Input type="file" accept="image/png, image/jpeg, image/webp" multiple
          onChange={(e) => {
            if (e.target.files) {
              if (imageFiles.length >= 3) {
                toast.toast({ title: "Максимальное количество изображений - 3", variant: "destructive" });
                return;
              }

              let files = Array.from(e.target.files).filter((file) => {
                if (file.size > 1 * 1024 * 1024) {
                  toast.toast({ title: "Максимальный размер изображения - 1MB", variant: "destructive" });
                  return false
                }
                return true;
              })

              console.log(files)

              setImageFiles([...imageFiles, ...files]);
            }
          }}
        />
      </label>
    </div>
  );
}

async function ImagesToBase64(images: File[]): Promise<string[]> {
  const imagesBase64 = await Promise.all(
    images.map(async (image) => {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      return base64;
    })
  );
  return imagesBase64 as string[];
}

export default function CreateListing() {
  const [open, setOpen] = useState<boolean>(false);

  const toast = useToast();
  const utils = api.useUtils();
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const createMutation = api.product.create.useMutation({
    onSuccess: () => {
      utils.product.invalidate();
      toast.toast({ title: "Объявление создано" });
      form.reset();
      router.refresh();
      setOpen(false);
    },
    onError: (e) => {
      console.error(e)
      toast.toast({ title: "Не удалось создать объявление", variant: "destructive" });
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
  });

  const form = useForm<z.infer<typeof formSchema>>({
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
    createMutation.mutate({
      ...data,
      images: images
    });
    setImagesLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">Создать объявление</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <DialogHeader>
              <DialogTitle className="pb-2">Создание объявления</DialogTitle>
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
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Категория..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
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
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={createMutation.isPending || imagesLoading} className="gap-2">
                {createMutation.isPending || imagesLoading && <Loading />}
                Создать</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
