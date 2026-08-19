import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/supabase/restaurants";
import { buttonClass } from "@/lib/buttonStyles";
import AvatarUpload from "@/components/AvatarUpload";
import FavoriteButton from "@/components/FavoriteButton";
import ProfileNameEditor from "@/components/ProfileNameEditor";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Restaurant[]>();

  const { data: myFavorites } = await supabase
    .from("favorites")
    .select("restaurant_id, restaurants(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<{ restaurant_id: string; restaurants: Restaurant | null }[]>();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-4">
        <AvatarUpload
          userId={user.id}
          avatarUrl={user.user_metadata?.avatar_url ?? null}
          name={user.user_metadata?.full_name ?? user.email ?? ""}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
            {user.user_metadata?.full_name ?? "โปรไฟล์ของฉัน"}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">{user.email}</p>
          <ProfileNameEditor
            initialName={user.user_metadata?.full_name ?? user.email ?? ""}
            changedAt={user.user_metadata?.full_name_changed_at ?? null}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">ร้านของฉัน</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/profile/my-bookings"
              className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              การจองของฉัน
            </Link>
            <Link
              href="/profile/reservations"
              className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              การจองที่เข้ามา
            </Link>
            <Link href="/profile/restaurants/new" className={buttonClass("primary", "sm")}>
              เพิ่มร้านใหม่
            </Link>
          </div>
        </div>

        {!restaurants || restaurants.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
            คุณยังไม่ได้ลงร้านอาหาร กดปุ่ม &quot;เพิ่มร้านใหม่&quot; เพื่อเริ่มต้น
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/profile/restaurants/${restaurant.id}/edit`}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={restaurant.cover_photo_url}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-stone-900 dark:text-stone-50">
                    {restaurant.name}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">แก้ไขร้าน</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">รายการโปรด</h2>

        {!myFavorites || myFavorites.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
            คุณยังไม่มีร้านโปรด กดรูปหัวใจที่การ์ดร้านหรือหน้าร้านเพื่อบันทึกไว้
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {myFavorites
              .filter((f) => f.restaurants)
              .map((f) => (
                <Link
                  key={f.restaurant_id}
                  href={`/restaurants/${f.restaurant_id}`}
                  className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={f.restaurants!.cover_photo_url}
                      alt={f.restaurants!.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-stone-900 dark:text-stone-50">
                      {f.restaurants!.name}
                    </p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">ดูร้าน</p>
                  </div>
                  <FavoriteButton
                    restaurantId={f.restaurant_id}
                    userId={user.id}
                    initialFavorited
                  />
                </Link>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
