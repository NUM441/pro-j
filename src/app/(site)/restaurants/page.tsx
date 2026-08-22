import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/supabase/restaurants";
import RestaurantCard, { type RestaurantWithReviews } from "@/components/RestaurantCard";
import SearchForm from "@/components/SearchForm";
import { chipClass } from "@/lib/buttonStyles";

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
    <main className="flex w-full flex-1 flex-col gap-6 px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">ร้านอาหารในนครสวรรค์</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          รวมร้านอาหารที่สมาชิกในชุมชนแนะนำ
        </p>
      </div>

      <SearchForm
        defaultValue={q}
        category={category}
        className="mx-auto flex w-full max-w-sm items-center justify-center gap-2"
      />

      <div className="flex flex-wrap justify-center gap-2">
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
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-stone-50 p-10 text-center text-sm text-stone-500 dark:bg-stone-900 dark:text-stone-400">
          {q ? (
            `ไม่พบร้านที่ชื่อตรงกับ "${q}"`
          ) : category ? (
            `ยังไม่มีร้านในหมวด "${category}"`
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                <UtensilsCrossed className="h-5 w-5 text-stone-400 dark:text-stone-500" />
              </span>
              ยังไม่มีร้านอาหารในระบบ
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              currentUserId={userData.user?.id ?? null}
              isFavorited={favoritedIds.has(restaurant.id)}
              headingLevel="h2"
            />
          ))}
        </div>
      )}
    </main>
  );
}
