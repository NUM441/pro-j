import { createAdminClient } from "@/lib/supabase/admin";
import type { Restaurant } from "@/lib/supabase/restaurants";
import AdminRestaurantsList from "./AdminRestaurantsList";

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

  const rows = (restaurants ?? []).map((r) => {
    const owner = ownerInfo.get(r.owner_id);
    return {
      id: r.id,
      ownerId: r.owner_id,
      name: r.name,
      coverPhotoUrl: r.cover_photo_url,
      ownerName: owner?.name ?? "",
      ownerEmail: owner?.email ?? "",
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold break-words tracking-tight text-stone-900 dark:text-stone-50">ร้านอาหารทั้งหมด</h1>
      <AdminRestaurantsList initialRestaurants={rows} />
    </div>
  );
}
