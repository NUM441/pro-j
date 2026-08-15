import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type Restaurant } from "@/lib/supabase/restaurants";
import { averageRating } from "@/lib/supabase/reviews";
import StarRating from "@/components/StarRating";
import FavoriteButton from "@/components/FavoriteButton";
import { chipClass } from "@/lib/buttonStyles";

type RestaurantWithReviews = Restaurant & { reviews: { rating: number }[] };

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("restaurants")
    .select("*, reviews(rating)")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.contains("categories", [category]);
  }
  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  const [{ data: restaurants }, { data: userData }] = await Promise.all([
    query.returns<RestaurantWithReviews[]>(),
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

  const qSuffix = q ? `&q=${encodeURIComponent(q)}` : "";

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">ร้านอาหารในนครสวรรค์</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          รวมร้านอาหารที่สมาชิกในชุมชนแนะนำ
        </p>
      </div>

      <form action="/restaurants" method="get" className="flex items-center gap-2">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="🔍 ค้นหาชื่อร้าน..."
          className="w-full max-w-sm rounded-full border border-stone-300 px-4 py-2 text-sm outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
        <button type="submit" className={chipClass(false)}>
          ค้นหา
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link href={q ? `/restaurants?q=${encodeURIComponent(q)}` : "/restaurants"} className={chipClass(!category)}>
          ทั้งหมด
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/restaurants?category=${encodeURIComponent(c)}${qSuffix}`}
            className={chipClass(category === c)}
          >
            {c}
          </Link>
        ))}
      </div>

      {!restaurants || restaurants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
          {q
            ? `ไม่พบร้านที่ชื่อตรงกับ "${q}"`
            : category
              ? `ยังไม่มีร้านในหมวด "${category}"`
              : "ยังไม่มีร้านอาหารในระบบ 🍜"}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="flex flex-col overflow-hidden rounded-xl border border-stone-200 transition hover:shadow-md dark:border-stone-800"
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
                <h2 className="font-semibold text-stone-900 dark:text-stone-50">
                  {restaurant.name}
                </h2>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={averageRating(restaurant.reviews)} />
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    ({restaurant.reviews.length})
                  </span>
                </div>
                {restaurant.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {restaurant.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                <p className="line-clamp-2 text-sm text-stone-500 dark:text-stone-400">
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
