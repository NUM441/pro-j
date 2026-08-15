"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/lib/buttonStyles";

type Props = {
  restaurantId: string;
  currentUserId: string | null;
  currentUserName: string;
};

export default function ReservationForm({ restaurantId, currentUserId, currentUserName }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!currentUserId) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        <Link href="/login" className="font-medium text-green-700 hover:underline dark:text-green-400">
          เข้าสู่ระบบ
        </Link>{" "}
        เพื่อจองโต๊ะ
      </p>
    );
  }

  if (submitted) {
    return (
      <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
        ส่งคำขอจองแล้ว รอร้านยืนยัน
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-fit ${buttonClass("primary", "sm")}`}
      >
        จองโต๊ะ
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: dbError } = await supabase.from("reservations").insert({
      restaurant_id: restaurantId,
      customer_id: currentUserId,
      customer_name: currentUserName,
      customer_phone: phone,
      party_size: partySize,
      reservation_date: date,
      reservation_time: time,
      note,
    });

    if (dbError) {
      setError("จองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            วันที่
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="time" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            เวลา
          </label>
          <input
            id="time"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="partySize" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            จำนวนคน
          </label>
          <input
            id="partySize"
            type="number"
            min={1}
            required
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            เบอร์โทร
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          หมายเหตุ (ถ้ามี)
        </label>
        <textarea
          id="note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className={buttonClass("primary", "sm")}
        >
          {loading ? "กำลังส่ง..." : "ยืนยันการจอง"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
