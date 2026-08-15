import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/supabase/restaurants";
import type { Reservation } from "@/lib/supabase/reservations";
import { buttonClass } from "@/lib/buttonStyles";
import AvatarUpload from "@/components/AvatarUpload";

const STATUS_LABEL = {
  pending: "รอดำเนินการ",
  confirmed: "ยืนยันแล้ว",
  declined: "ปฏิเสธแล้ว",
};

const STATUS_STYLE = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  declined: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Restaurant[]>();

  const { data: myReservations } = await supabase
    .from("reservations")
    .select("*, restaurants(name)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .returns<(Reservation & { restaurants: { name: string } | null })[]>();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-4">
        <AvatarUpload
          userId={user.id}
          avatarUrl={user.user_metadata?.avatar_url ?? null}
          name={user.user_metadata?.full_name ?? user.email ?? ""}
        />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {user.user_metadata?.full_name ?? "โปรไฟล์ของฉัน"}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">ร้านของฉัน</h2>
          <div className="flex items-center gap-3">
            <Link
              href="/profile/reservations"
              className="text-sm font-medium text-green-700 hover:underline dark:text-green-400"
            >
              การจองที่เข้ามา
            </Link>
            <Link href="/profile/restaurants/new" className={buttonClass("primary", "sm")}>
              เพิ่มร้านใหม่
            </Link>
          </div>
        </div>

        {!restaurants || restaurants.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            คุณยังไม่ได้ลงร้านอาหาร กดปุ่ม &quot;เพิ่มร้านใหม่&quot; เพื่อเริ่มต้น
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/profile/restaurants/${restaurant.id}/edit`}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 transition hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
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
                  <p className="truncate font-medium text-neutral-900 dark:text-neutral-50">
                    {restaurant.name}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">แก้ไขร้าน</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">การจองของฉัน</h2>

        {!myReservations || myReservations.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            คุณยังไม่เคยจองร้านอาหาร
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {myReservations.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3 dark:border-neutral-800"
              >
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">
                    {r.restaurants?.name ?? "ร้าน"}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {r.reservation_date} เวลา {r.reservation_time} · {r.party_size} ที่นั่ง
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
