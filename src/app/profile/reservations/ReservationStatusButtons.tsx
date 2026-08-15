"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ReservationStatus } from "@/lib/supabase/reservations";

export default function ReservationStatusButtons({
  reservationId,
  status,
}: {
  reservationId: string;
  status: ReservationStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(next: ReservationStatus) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("reservations").update({ status: next }).eq("id", reservationId);
    setLoading(false);
    router.refresh();
  }

  if (status !== "pending") {
    return (
      <button
        type="button"
        onClick={() => updateStatus("pending")}
        disabled={loading}
        className="text-xs text-neutral-500 hover:underline disabled:opacity-60 dark:text-neutral-400"
      >
        เปลี่ยนกลับเป็นรอดำเนินการ
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => updateStatus("confirmed")}
        disabled={loading}
        className="rounded-full bg-green-700 px-3 py-1 text-xs font-medium text-white transition hover:bg-green-600 disabled:opacity-60"
      >
        ยืนยัน
      </button>
      <button
        type="button"
        onClick={() => updateStatus("declined")}
        disabled={loading}
        className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        ปฏิเสธ
      </button>
    </div>
  );
}
