import ListingCard from "~/components/listing_card";
import NotFoundPage from "~/components/not-found";
import { categories } from "~/shared";
import { api } from "~/trpc/server";

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const category = categories.find((c) => c.id === params.id)

  if (!category) {
    return <NotFoundPage />
  }

  const listings = await api.product.getByCategory({ id: params.id })

  return (
    <div className="container mx-auto bg-background rounded-xl p-8 space-y-4">
      <h1 className="text-5xl">{category.title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard listing={listing} />
        ))}
      </div>
    </div>
  );
}
