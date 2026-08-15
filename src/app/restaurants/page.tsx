import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/supabase/restaurants";
import { averageRating } from "@/lib/supabase/reviews";
import StarRating from "@/components/StarRating";

type RestaurantWithReviews = Restaurant & { reviews: { rating: number }[] };

export default async function RestaurantsPage() {
  const supabase = await createClient();
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*, reviews(rating)")
    .order("created_at", { ascending: false })
    .returns<RestaurantWithReviews[]>();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">ร้านอาหารในนครสวรรค์</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          รวมร้านอาหารที่สมาชิกในชุมชนแนะนำ
        </p>
      </div>

      {!restaurants || restaurants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          ยังไม่มีร้านอาหารในระบบ 🍜
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 transition hover:shadow-md dark:border-neutral-800"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={restaurant.cover_photo_url}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col gap-1 p-4">
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">
                  {restaurant.name}
                </h2>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={averageRating(restaurant.reviews)} />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    ({restaurant.reviews.length})
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                  {restaurant.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
