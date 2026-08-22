import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { RestaurantWithReviews } from "@/components/RestaurantCard";
import RestaurantRow from "@/components/RestaurantRow";
import SearchForm from "@/components/SearchForm";
import HeroGraphic from "@/components/HeroGraphic";
import { UtensilsCrossed } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: latest }, { data: userData }] = await Promise.all([
    supabase
      .from("restaurants")
      .select("*, reviews(rating)")
      .order("created_at", { ascending: false })
      .limit(10)
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
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col items-start gap-4 text-left">
            <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-medium text-stone-900 backdrop-blur-sm">
              นครสวรรค์ / ปากน้ำโพ
            </span>
            <h1 className="text-4xl font-bold break-words tracking-tight text-stone-950 sm:text-5xl">
              ร้านอาหารอร่อยทั่วนครสวรรค์
              <br />
              ค้นเจอง่าย ในไม่กี่วินาที
            </h1>
            <p className="max-w-md text-stone-900/80">
              รวมร้านเด็ด ของกิน และของฝากในนครสวรรค์ ที่สมาชิกในชุมชนช่วยกันแนะนำ
              ค้นหา รีวิว และบันทึกร้านโปรดได้ในที่เดียว
            </p>
            <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <SearchForm onDark className="w-full sm:w-auto" />
              <Link
                href="/restaurants"
                className="rounded-full border border-stone-900/20 px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-black/10"
              >
                ดูร้านทั้งหมด
              </Link>
            </div>
          </div>
          <div className="relative mx-auto hidden aspect-square w-full max-w-md items-center justify-center lg:flex">
            <HeroGraphic />
          </div>
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
