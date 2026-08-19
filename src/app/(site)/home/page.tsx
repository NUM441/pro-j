import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import RestaurantCard, { type RestaurantWithReviews } from "@/components/RestaurantCard";
import SearchForm from "@/components/SearchForm";

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
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          นครสวรรค์ / ปากน้ำโพ
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Nakhon Sawan Food Guide
        </h1>
        <p className="max-w-xl text-balance text-stone-600 dark:text-stone-400">
          คู่มือร้านอาหารนครสวรรค์ รวมร้านเด็ด ของกิน และของฝาก
          สำหรับนักท่องเที่ยว คนในพื้นที่ และนักเดินทางที่แวะผ่านเมืองปากน้ำโพ
        </p>
        <SearchForm className="mt-2 flex w-full max-w-sm items-center justify-center gap-2" />
      </section>

      <section className="w-full px-4 pb-24 sm:px-6">
        {!restaurants || restaurants.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
            <UtensilsCrossed className="h-6 w-6" />
            รายชื่อร้านอาหารกำลังจะมาเร็ว ๆ นี้
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                ร้านล่าสุด
              </h2>
              <Link
                href="/restaurants"
                className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
              >
                ดูร้านทั้งหมด <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  currentUserId={userData.user?.id ?? null}
                  isFavorited={favoritedIds.has(restaurant.id)}
                  headingLevel="h3"
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
