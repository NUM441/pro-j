import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Restaurant } from "@/lib/supabase/restaurants";
import { averageRating } from "@/lib/supabase/reviews";
import FavoriteButton from "@/components/FavoriteButton";

export type RestaurantWithReviews = Restaurant & { reviews: { rating: number }[] };

export default function RestaurantCard({
  restaurant,
  currentUserId,
  isFavorited,
  headingLevel: Heading,
}: {
  restaurant: RestaurantWithReviews;
  currentUserId: string | null;
  isFavorited: boolean;
  headingLevel: "h2" | "h3";
}) {
  const rating = averageRating(restaurant.reviews);
  const hasReviews = restaurant.reviews.length > 0;
  const primaryCategory = restaurant.categories[0];

  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:shadow-xl dark:bg-stone-900"
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={restaurant.cover_photo_url}
          alt={restaurant.name}
          fill
          sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
          unoptimized
        />
        {hasReviews && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </span>
        )}
        {currentUserId && (
          <FavoriteButton
            restaurantId={restaurant.id}
            userId={currentUserId}
            initialFavorited={isFavorited}
            className="absolute top-2 right-2 bg-black/40 hover:bg-black/60"
            iconClassName="fill-none text-white"
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-4">
        <Heading className="truncate font-semibold text-stone-900 dark:text-stone-50">
          {restaurant.name}
        </Heading>
        {primaryCategory && (
          <p className="text-sm text-stone-500 dark:text-stone-400">{primaryCategory}</p>
        )}
      </div>
    </Link>
  );
}
