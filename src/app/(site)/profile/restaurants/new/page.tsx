import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { OwnerApplication } from "@/lib/supabase/owner-applications";
import RestaurantForm from "../RestaurantForm";
import OwnerApplicationForm from "../OwnerApplicationForm";

export default async function NewRestaurantPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  const { data: application } = await supabase
    .from("owner_applications")
    .select("*")
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<OwnerApplication>();

  if (!application) {
    return (
      <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-12">
        <OwnerApplicationForm />
      </main>
    );
  }

  if (application.status === "pending") {
    return (
      <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-12">
        <h1 className="text-3xl font-bold break-words tracking-tight text-stone-900 dark:text-stone-50">สมัครเป็นเจ้าของร้าน</h1>
        <p className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300">
          คำขอของคุณ (ร้าน &quot;{application.restaurant_name}&quot;) กำลังรอแอดมินตรวจสอบและอนุมัติ
        </p>
      </main>
    );
  }

  if (application.status === "rejected") {
    return (
      <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-12">
        <OwnerApplicationForm rejected />
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-bold break-words tracking-tight text-stone-900 dark:text-stone-50">เพิ่มร้านใหม่</h1>
      <RestaurantForm mode="new" ownerId={user.id} />
    </main>
  );
}
