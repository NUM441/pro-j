import { createClient } from "@/lib/supabase/server";
import type { RestaurantWithReviews } from "@/components/RestaurantCard";
import RestaurantRow from "@/components/RestaurantRow";
import SearchForm from "@/components/SearchForm";
import { UtensilsCrossed } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: latest }, { data: userData }] = await Promise.all([
    supabase
      .from("restaurants")
      .select("*, reviews(rating)")
      .order("created_at", { ascending: false })
      .limit(12)
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
      <section className="bg-stone-900">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center sm:py-20">
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-stone-100 backdrop-blur-sm">
            นครสวรรค์ / ปากน้ำโพ
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Nakhon Sawan Food Guide
          </h1>
          <p className="max-w-xl text-balance text-lg text-stone-300">
            คู่มือร้านอาหารนครสวรรค์ รวมร้านเด็ด ของกิน และของฝาก
            สำหรับนักท่องเที่ยว คนในพื้นที่ และนักเดินทางที่แวะผ่านเมืองปากน้ำโพ
          </p>
          <SearchForm onDark className="mt-2 flex w-full max-w-sm items-center justify-center gap-2" />
        </div>
      </section>

      <div className="py-10">
        {!latest || latest.length === 0 ? (
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 text-center text-sm text-stone-500 sm:px-6 dark:text-stone-400">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
              <UtensilsCrossed className="h-5 w-5 text-stone-400 dark:text-stone-500" />
            </span>
            รายชื่อร้านอาหารกำลังจะมาเร็ว ๆ นี้
          </div>
        ) : (
          <RestaurantRow
            title="ร้านล่าสุด"
            viewAllHref="/restaurants"
            restaurants={latest}
            currentUserId={userData.user?.id ?? null}
            favoritedIds={favoritedIds}
          />
        )}
      </div>
    </main>
  );
}
