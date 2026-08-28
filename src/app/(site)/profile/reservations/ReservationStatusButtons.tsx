"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/lib/buttonStyles";
import type { ReservationStatus } from "@/lib/supabase/reservations";

export default function ReservationStatusButtons({
  reservationId,
  status,
  reservationDate,
  reservationTime,
}: {
  reservationId: string;
  status: ReservationStatus;
  reservationDate: string;
  reservationTime: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const reservationDateTime = new Date(`${reservationDate}T${reservationTime}:00+07:00`);
      setIsLate(Date.now() > reservationDateTime.getTime());
    }, 0);
    return () => clearTimeout(timeout);
  }, [reservationDate, reservationTime]);

  async function updateStatus(next: ReservationStatus) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("reservations").update({ status: next }).eq("id", reservationId);
    setLoading(false);
    router.refresh();
  }

  if (status === "pending") {
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

  if (status === "confirmed") {
    return (
      <div className="flex flex-col items-start gap-1.5">
        {isLate && (
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
            เลยเวลานัดแล้ว ลูกค้ามาถึงหรือยัง?
          </p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => updateStatus("arrived")}
            disabled={loading}
            className={buttonClass("primary", "sm")}
          >
            ลูกค้ามาแล้ว
          </button>
          <button
            type="button"
            onClick={() => updateStatus("no_show")}
            disabled={loading}
            className={buttonClass("danger", "sm")}
          >
            ลูกค้าไม่มา
          </button>
          <button
            type="button"
            onClick={() => updateStatus("pending")}
            disabled={loading}
            className="text-xs text-stone-500 hover:underline disabled:opacity-60 dark:text-stone-400"
          >
            ยกเลิกการยืนยัน
          </button>
        </div>
      </div>
    );
  }

  if (status === "arrived") {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => updateStatus("checked_out")}
          disabled={loading}
          className={buttonClass("primary", "sm")}
        >
          เช็คเอาท์
        </button>
        <button
          type="button"
          onClick={() => updateStatus("confirmed")}
          disabled={loading}
          className="text-xs text-stone-500 hover:underline disabled:opacity-60 dark:text-stone-400"
        >
          ยกเลิก
        </button>
      </div>
    );
  }

  const revertTarget: ReservationStatus = status === "checked_out" ? "arrived" : status === "no_show" ? "confirmed" : "pending";
  const revertLabel =
    status === "checked_out"
      ? "เปลี่ยนกลับเป็นลูกค้ามาแล้ว"
      : status === "no_show"
        ? "เปลี่ยนกลับเป็นยืนยันแล้ว"
        : "เปลี่ยนกลับเป็นรอดำเนินการ";

  return (
    <button
      type="button"
      onClick={() => updateStatus(revertTarget)}
      disabled={loading}
      className="text-xs text-stone-500 hover:underline disabled:opacity-60 dark:text-stone-400"
    >
      {revertLabel}
    </button>
  );
}
