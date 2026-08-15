import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RestaurantForm from "../RestaurantForm";

export default async function NewRestaurantPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">เพิ่มร้านใหม่</h1>
      <RestaurantForm mode="new" ownerId={user.id} />
    </main>
  );
}
