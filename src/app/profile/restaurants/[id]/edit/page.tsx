import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/supabase/restaurants";
import RestaurantForm from "../../RestaurantForm";

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single<Restaurant>();

  if (!restaurant) {
    notFound();
  }

  if (restaurant.owner_id !== user.id) {
    redirect("/profile");
  }

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">แก้ไขร้าน</h1>
      <RestaurantForm mode="edit" ownerId={user.id} restaurant={restaurant} />
    </main>
  );
}
