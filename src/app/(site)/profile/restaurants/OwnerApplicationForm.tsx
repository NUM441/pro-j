"use client";

import { useState } from "react";
import { buttonClass } from "@/lib/buttonStyles";

export default function OwnerApplicationForm({ rejected }: { rejected?: boolean }) {
  const [restaurantName, setRestaurantName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
        ส่งคำขอแล้ว รอแอดมินตรวจสอบและอนุมัติ
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/owner-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantName, phone, message }),
    });

    if (!res.ok) {
      setError("ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">สมัครเป็นเจ้าของร้าน</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {rejected
            ? "คำขอก่อนหน้าของคุณถูกปฏิเสธ กรอกข้อมูลแล้วส่งคำขอใหม่ได้อีกครั้ง"
            : "ก่อนลงร้านอาหารได้ ต้องกรอกข้อมูลเพื่อให้แอดมินตรวจสอบและอนุมัติก่อน"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-lg flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="restaurantName" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            ชื่อร้าน
          </label>
          <input
            id="restaurantName"
            type="text"
            required
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            เบอร์โทรติดต่อ
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            ข้อความยืนยันสั้นๆ
          </label>
          <textarea
            id="message"
            required
            rows={3}
            placeholder="เช่น ยืนยันว่าเป็นเจ้าของ/ผู้ดูแลร้านนี้จริง"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:ring-emerald-500/20"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-fit ${buttonClass("primary")}`}
        >
          {loading ? "กำลังส่ง..." : "ส่งคำขอ"}
        </button>
      </form>
    </div>
  );
}
