import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Restaurant } from "@/lib/supabase/restaurants";
import DeleteRestaurantButton from "./DeleteRestaurantButton";

export default async function AdminRestaurantsPage() {
  const adminClient = createAdminClient();
  const { data: restaurants } = await adminClient
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Restaurant[]>();

  const ownerInfo = new Map<string, { name: string; email: string }>();
  await Promise.all(
    [...new Set((restaurants ?? []).map((r) => r.owner_id))].map(async (ownerId) => {
      const { data } = await adminClient.auth.admin.getUserById(ownerId);
      if (data.user) {
        ownerInfo.set(ownerId, {
          name: data.user.user_metadata?.full_name ?? data.user.email ?? ownerId,
          email: data.user.email ?? "",
        });
      }
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">ร้านอาหารทั้งหมด</h1>

      {!restaurants || restaurants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
          ยังไม่มีร้านอาหารในระบบ
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {restaurants.map((r) => {
            const owner = ownerInfo.get(r.owner_id);
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image src={r.cover_photo_url} alt={r.name} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-stone-900 dark:text-stone-50">{r.name}</p>
                  <p className="truncate text-sm text-stone-500 dark:text-stone-400">
                    เจ้าของ: {owner?.name ?? "ไม่พบบัญชี"}
                    {owner?.email ? ` · ${owner.email}` : ""}
                  </p>
                </div>
                <DeleteRestaurantButton restaurantId={r.id} ownerId={r.owner_id} restaurantName={r.name} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
