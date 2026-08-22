import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Reservation } from "@/lib/supabase/reservations";

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

export default async function MyBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  const { data: myReservations } = await supabase
    .from("reservations")
    .select("*, restaurants(name)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .returns<ReservationWithRestaurant[]>();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">การจองของฉัน</h1>

      {!myReservations || myReservations.length === 0 ? (
        <p className="rounded-2xl bg-stone-50 p-8 text-center text-sm text-stone-500 dark:bg-stone-900 dark:text-stone-400">
          คุณยังไม่เคยจองร้านอาหาร
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {myReservations.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900"
            >
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-50">
                  {r.restaurants?.name ?? "ร้าน"}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
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
    </main>
  );
}
