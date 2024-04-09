import Link from "next/link";
import { Button } from "./ui/button";

export default function NotFoundPage() {
  return (
    <main className="w-screen flex flex-col gap-1 items-center justify-center">
      <h1 className="text-9xl font-bold">404</h1>
      <h1 className="text-foreground/80">Страница не найдена</h1>
      <Link href="/" className="mt-4">
        <Button>
          На главную
        </Button>
      </Link>
    </main>
  );
}
