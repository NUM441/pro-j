import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Reservation } from "@/lib/supabase/reservations";
import ReservationStatusButtons from "./ReservationStatusButtons";

type ReservationWithRestaurant = Reservation & { restaurants: { name: string } | null };

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

export default async function OwnerReservationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  const { data: ownedRestaurants } = await supabase
    .from("restaurants")
    .select("id")
    .eq("owner_id", user.id)
    .returns<{ id: string }[]>();

  const restaurantIds = (ownedRestaurants ?? []).map((r) => r.id);

  const { data: reservations } = restaurantIds.length
    ? await supabase
        .from("reservations")
        .select("*, restaurants(name)")
        .in("restaurant_id", restaurantIds)
        .order("created_at", { ascending: false })
        .returns<ReservationWithRestaurant[]>()
    : { data: [] as ReservationWithRestaurant[] };

  const adminClient = createAdminClient();
  const currentNames = new Map<string, string>();
  await Promise.all(
    [...new Set((reservations ?? []).map((r) => r.customer_id))].map(async (customerId) => {
      const { data } = await adminClient.auth.admin.getUserById(customerId);
      const currentName = data.user?.user_metadata?.full_name;
      if (currentName) currentNames.set(customerId, currentName);
    }),
  );

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">การจองที่เข้ามา</h1>

      {!reservations || reservations.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          ยังไม่มีการจองเข้ามา
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reservations.map((r) => (
            <div key={r.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-50">
                    {r.restaurants?.name ?? "ร้าน"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {currentNames.get(r.customer_id) ?? r.customer_name} · {r.customer_phone}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300">
                {r.reservation_date} เวลา {r.reservation_time} · {r.party_size} ที่นั่ง
              </p>

              {r.note && <p className="text-sm text-slate-500 dark:text-slate-400">หมายเหตุ: {r.note}</p>}

              <ReservationStatusButtons reservationId={r.id} status={r.status} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
