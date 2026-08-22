import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RestaurantCard, { type RestaurantWithReviews } from "@/components/RestaurantCard";

export default function RestaurantRow({
  title,
  viewAllHref,
  restaurants,
  currentUserId,
  favoritedIds,
}: {
  title: string;
  viewAllHref: string;
  restaurants: RestaurantWithReviews[];
  currentUserId: string | null;
  favoritedIds: Set<string>;
}) {
  if (restaurants.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">{title}</h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          ดูทั้งหมด <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="w-56 shrink-0 snap-start sm:w-60">
            <RestaurantCard
              restaurant={restaurant}
              currentUserId={currentUserId}
              isFavorited={favoritedIds.has(restaurant.id)}
              headingLevel="h3"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
