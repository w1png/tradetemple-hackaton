"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export default function ImageSlider({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="rounded-xl grid grid-cols-4 grid-rows-1 col-span-2 gap-2 overflow-y-scroll">
      {images.length > 1 && (
        <div className="col-span-1 flex flex-col gap-4 px-2">
          {images.map((image, index) => (
            <Image
              width={100}
              height={100}
              src={image}
              unoptimized
              alt="Главная картинка объявления"
              placeholder="empty"
              onClick={() => setSelectedImage(index)}
              className={`cursor-pointer w-full aspect-square rounded-xl object-cover transition-colors ease-in-out duration-300
                ${index === selectedImage && "border-2 border-primary"}
      ${index !== selectedImage && "hover:border-primary/60 border-2 border-background"}
              `}
              key={index}
            />
          ))}
        </div>
      )}
      <div className="w-full spect-square col-span-3">
        {images[selectedImage] ? (
          <Image
            width={100}
            height={100}
            src={images[selectedImage] || ""}
            unoptimized
            alt="Главная картинка объявления"
            placeholder="empty"
            className="w-full rounded-xl object-cover"
          />
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </div>
    </div>
  );
}
