"use client";

import Link from "next/link";
import { FaBagShopping } from "react-icons/fa6";
import { api } from "~/trpc/react";

export default function NavbarCartButton() {
  const count = api.cart.getCount.useQuery();

  return (
    <Link href="/cart" className="hover:scale-105 transition-transform ease-in-out duration-300 size-6 grid grid-cols-4 grid-rows-4">
      <div className="h-6 aspect-square cursor-pointer col-span-full row-span-full z-0">
        <FaBagShopping className="h-full w-full" />
      </div>
      <p className="size-4 text-background pointer-events-none rounded-full bg-primary foreground/50 flex items-center justify-center text-[8px] col-start-3 row-start-3 col-span-2 row-span-2 z-10">
        {count.data || 0}
      </p>
    </Link>
  );
}
