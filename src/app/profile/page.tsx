import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/supabase/restaurants";
import ChangePasswordForm from "./ChangePasswordForm";

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

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          {user.user_metadata?.full_name ?? "โปรไฟล์ของฉัน"}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">ร้านของฉัน</h2>
          <Link
            href="/profile/restaurants/new"
            className="rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            เพิ่มร้านใหม่
          </Link>
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

      <div className="flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">เปลี่ยนรหัสผ่าน</h2>
        <ChangePasswordForm />
      </div>
    </main>
  );
}
