"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type ProfileTab = {
  name: string,
  href: string,
}

export function ProfileTabsLayout({ children, tabs }:
  {
    children: React.ReactNode,
    tabs: ProfileTab[]
  }) {

  const pathName = usePathname();

  return (
    <div className="flex flex-col gap-2 h-full w-full bg-background rounded-xl p-4">
      <nav className="w-full flex flex-row gap-4 px-2 h-10 overflow-scroll">
        {tabs.map((tab) => (
          <Link href={tab.href}
            className={`text-xl px-4 border-b-2
${pathName === tab.href ? "border-primary text-primary hover:border-primary/80 hover:text-primary/80" : "border-border hover:border-foreground/40"}
transition-colors ease-in-out duration-300`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
