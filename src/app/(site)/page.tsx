import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/supabase/restaurants";
import { averageRating } from "@/lib/supabase/reviews";
import StarRating from "@/components/StarRating";
import FavoriteButton from "@/components/FavoriteButton";

type RestaurantWithReviews = Restaurant & { reviews: { rating: number }[] };

export default async function Home() {
  const supabase = await createClient();
  const [{ data: restaurants }, { data: userData }] = await Promise.all([
    supabase
      .from("restaurants")
      .select("*, reviews(rating)")
      .order("created_at", { ascending: false })
      .limit(6)
      .returns<RestaurantWithReviews[]>(),
    supabase.auth.getUser(),
  ]);

  let favoritedIds = new Set<string>();
  if (userData.user) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("restaurant_id")
      .eq("user_id", userData.user.id);
    favoritedIds = new Set((favorites ?? []).map((f) => f.restaurant_id));
  }

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center sm:py-24">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          นครสวรรค์ / ปากน้ำโพ
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
          Nakhon Sawan Food Guide
        </h1>
        <p className="max-w-xl text-balance text-slate-600 dark:text-slate-400">
          คู่มือร้านอาหารนครสวรรค์ รวมร้านเด็ด ของกิน และของฝาก
          สำหรับนักท่องเที่ยว คนในพื้นที่ และนักเดินทางที่แวะผ่านเมืองปากน้ำโพ
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-24">
        {!restaurants || restaurants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            รายชื่อร้านอาหารกำลังจะมาเร็ว ๆ นี้ 🍜
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                ร้านล่าสุด
              </h2>
              <Link
                href="/restaurants"
                className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
              >
                ดูร้านทั้งหมด →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {restaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 transition hover:shadow-md dark:border-slate-800"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={restaurant.cover_photo_url}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {userData.user && (
                      <FavoriteButton
                        restaurantId={restaurant.id}
                        userId={userData.user.id}
                        initialFavorited={favoritedIds.has(restaurant.id)}
                        className="absolute top-2 right-2 bg-black/40 hover:bg-black/60"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h3 className="truncate font-semibold text-slate-900 dark:text-slate-50">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={averageRating(restaurant.reviews)} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({restaurant.reviews.length})
                      </span>
                    </div>
                    {restaurant.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {restaurant.categories.map((c) => (
                          <span
                            key={c}
                            className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {restaurant.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
