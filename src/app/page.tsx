import Link from "next/link";
import ListingCard from "~/components/listing_card";
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { categories } from "~/shared";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  const c = await Promise.all(categories.map(async (category) => {
    const products = await api.product.getByCategory({ id: category.id })
    return {
      ...category,
      products: products
    }
  }))

  return (
    <div className="w-screen flex flex-col px-4">
      <Navbar />
      <section className="container mx-auto bg-background rounded-xl mb-8 min-h-[25rem] flex flex-col items-center justify-center gap-6">
        <p className="text-6xl text-center font-semibold">Не знаете как сделать<br />заказ?</p>
        <p className="text-center text-foreground/60">Подробная инструкция чтобы разобраться в базовых принципах<br /> функционирования нашел сайт</p>
        <Link href="/instructions">
          <Button>
            Подробнее
          </Button>
        </Link>
      </section>
      <main className="container mx-auto bg-background rounded-xl p-6 flex flex-col gap-10">
        {c.map((category) => (
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-4xl">{category.title}</p>
            <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {category.products.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
