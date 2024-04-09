import { getServerAuthSession } from "~/server/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Button } from "./ui/button";
import { FaUser, FaDoorOpen, FaTruck, FaList, FaStar } from "react-icons/fa";
import ThemeSwitch from "./theme_switch";
import CategoriesDropdown from "./categories-dropdown";
import Search from "./search";
import { Skeleton } from "./ui/skeleton";

function Logo() {
  return (
    <Link href="/" className="h-full aspect-square p-4">
      <Skeleton className="h-full w-full rounded-xl" />
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
              <DropdownMenuItem>
                <Link href="/profile" className="flex items-center gap-2">
                  <FaUser />
                  Профиль
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href="" className="flex items-center gap-2">
                  <FaTruck />
                  Заказы
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href="" className="flex items-center gap-2">
                  <FaStar />
                  Отзывы
                </Link>
              </DropdownMenuItem>



              <DropdownMenuItem>
                <Link href="/profile/listings" className="flex items-center gap-2">
                  <FaList />
                  Объявления
                </Link>
              </DropdownMenuItem>

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
        <ProfileDropdown />
      </div>
    </nav>
  );
}
