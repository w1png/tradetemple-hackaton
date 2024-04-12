import { getServerAuthSession } from "~/server/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Button } from "./ui/button";
import { FaUser, FaDoorOpen, FaTruck, FaList, FaStar } from "react-icons/fa";
import ThemeSwitch from "./theme_switch";
import CategoriesDropdown from "./categories-dropdown";
import Search from "./search";
import NavbarCartButton from "./navbar_cart_button";
import Image from "next/image";

function Logo() {
  return (
    <Link href="/" className="h-full p-4 flex flex-row items-center gap-2 group">
      <Image
        src="/logo.svg"
        alt="logo"
        width={100}
        height={100}
        className="size-10 group-hover:scale-105 group-hover:rotate-[8deg] transition-transform ease-in-out duration-300"
      />
      <p className="font-semibold">TradeTemple</p>
    </Link>
  );
}

async function ProfileDropdown() {
  const session = await getServerAuthSession();

  return (
    <>
      {
        session ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="border-primary border-2">
                <AvatarImage src={session.user.image || ""} />
                <AvatarFallback>
                  <FaUser />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2">
              <Link href="/profile/orders" >
                <DropdownMenuItem className="flex items-center gap-2">
                  <FaTruck />
                  Заказы
                </DropdownMenuItem>
              </Link>

              <Link href="/profile/reviews">
                <DropdownMenuItem className="flex items-center gap-2">
                  <FaStar />
                  Отзывы
                </DropdownMenuItem>
              </Link>

              <Link href="/profile/listings">
                <DropdownMenuItem className="flex items-center gap-2">
                  <FaList />
                  Объявления
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem>
                <ThemeSwitch />
              </DropdownMenuItem>

              <Link href="/api/auth/signout">
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <FaDoorOpen />
                    Выйти
                  </div>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu >
        ) : (
          <Link href="/api/auth/signin">
            <Button>
              Войти
            </Button>
          </Link>
        )
      }
    </>
  )
}

export default function Navbar() {
  return (
    <nav className="h-20 fixed top-0 w-screen flex left-0 z-30 bg-background">
      <div className="container mx-auto h-full items-center justify-between flex flex-row select-none gap-4">
        <Logo />
        <CategoriesDropdown />
        <Search />
        <NavbarCartButton />
        <ProfileDropdown />
      </div>
    </nav>
  );
}
