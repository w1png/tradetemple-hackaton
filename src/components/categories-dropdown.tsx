"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { FaBars } from "react-icons/fa";
import { categories } from "~/shared";

function CategoryCard({ category }: { category: typeof categories[number] }) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={category.url}>
      <Card className="aspect-video p-4 flex flex-col hover:bg-muted/40 transition-colors ease-in-out duration-300 gap-2">
        {category.title}
        {!isImageLoading || imageError ? <Skeleton className="grow rounded-xl" /> : (
          <Image
            src={category.image}
            alt={category.title}
            width={100}
            height={100}
            onError={() => setImageError(true)}
            onLoadingComplete={() => setIsImageLoading(false)}
          />
        )}
      </Card>
    </Link>

  );
}

export default function CategoriesDropdown() {
  const bg = useRef<HTMLDivElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!bg.current || !dropdown.current) return;
    if (isOpen) {
      bg.current.classList.remove("invisible");
      bg.current.classList.remove("opacity-0");
      dropdown.current.classList.remove("max-h-0");
      dropdown.current.classList.add("max-h-[calc(100svh-10rem)]");
    } else {
      bg.current.classList.add("invisible");
      bg.current.classList.add("opacity-0");
      dropdown.current.classList.remove("max-h-[calc(100svh-10rem)]");
      dropdown.current.classList.add("max-h-0");
    }

  }, [isOpen])

  return (
    <div className="z-0">
      <Button onClick={() => setIsOpen(!isOpen)} className="gap-2">
        <FaBars />
        Все категории
      </Button>
      <div ref={bg} onClick={() => setIsOpen(false)} className="opacity-0 invisible w-screen h-[calc(100svh-5rem)] top-20 bg-black/60 fixed inset-0 transition-all duration-500 ease-in-out"></div>
      <div ref={dropdown} className="max-h-0 fixed overflow-y-hidden top-20 container px-10 -translate-x-1/2 left-1/2 h-fit flex transition-all ease-in-out duration-500 gap-2">
        <div className="rounded-b-xl h-full p-4 w-full grid grid-cols-2 lg:grid-cols-3 bg-background gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

