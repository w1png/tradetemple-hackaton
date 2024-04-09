"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaDoorOpen } from "react-icons/fa";
import { FaGears, FaMessage, FaShop, FaTruck } from "react-icons/fa6";

function NavbarItem({
  pathName,
  index,
  name,
  icon,
  href,
}: {
  pathName: string,
  index: number,
  name: string,
  icon: JSX.Element,
  href: string
}) {
  return (
    <Link href={href} className={`
          w-fit lg:w-full h-full md:h-fit aspect-square lg:aspect-auto
          flex flex-row gap-2 justify-center lg:justify-start items-center
          hover:bg-muted p-3 rounded transition-colors ease-in-out duration-300
          text-xl 
          ${pathName.startsWith(href) ? "font-bold text-primary hover:text-primary" : "text-foreground/70 hover:text-foreground"}
          `} key={index}>
      {icon}
      <p className="hidden lg:block">{name}</p>
    </Link>

  );
}

export default function ProfileNavigation() {
  const pathName = usePathname();

  const iconsClass = "size-6";

  const menuItems = [
    {
      name: "Продажи",
      href: "/profile/listings",
      icon: <FaShop className={iconsClass} />
    },
    {
      name: "Заказы",
      href: "/profile/orders",
      icon: <FaTruck className={iconsClass} />
    },
    {
      name: "Отзывы",
      href: "/profile/reviews",
      icon: <FaMessage className={"p-0.5 " + iconsClass} />
    },
    {
      name: "Настройки",
      href: "/profile/settings",
      icon: <FaGears className={iconsClass} />
    },
  ]

  return (
    <div className="fixed bottom-4 left-4 right-4 md:static
      w-[calc(100vw-2rem)] md:w-fit lg:min-w-[250px]
      md:h-full
      shadow-xl md:shadow-none
      flex flex-row md:flex-col justify-between md:justify-start items-center lg:items-start
      bg-background rounded-xl p-2 md:p-4 md:space-y-6">
      {menuItems.map((item, index) => (
        <NavbarItem
          key={index}
          pathName={pathName}
          index={index}
          {...item}
        />
      ))}
      <div className="grow hidden md:flex items-end">
        <NavbarItem
          key={"logout"}
          pathName={pathName}
          index={menuItems.length}
          name="Выход"
          icon={<FaDoorOpen className={iconsClass} />}
          href="/auth/logout"
        />
      </div>
    </div>
  );
}

