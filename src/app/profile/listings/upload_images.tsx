import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";
import { FaTrash } from "react-icons/fa";
import { useToast } from "~/components/ui/use-toast";
import { Input } from "~/components/ui/input";

export default function ImageUpload({
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
