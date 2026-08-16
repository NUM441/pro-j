"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/lib/buttonStyles";
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
        className="text-xs text-slate-500 hover:underline disabled:opacity-60 dark:text-slate-400"
      >
        เปลี่ยนกลับเป็นรอดำเนินการ
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => updateStatus("confirmed")}
        disabled={loading}
        className={buttonClass("primary", "sm")}
      >
        ยืนยัน
      </button>
      <button
        type="button"
        onClick={() => updateStatus("declined")}
        disabled={loading}
        className={buttonClass("danger", "sm")}
      >
        ปฏิเสธ
      </button>
    </div>
  );
}
