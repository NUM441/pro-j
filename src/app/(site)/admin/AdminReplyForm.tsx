"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/lib/buttonStyles";

export default function AdminReplyForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    setError(null);

    const res = await fetch("/api/admin/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message }),
    });

    if (!res.ok) {
      setError("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setSending(false);
      return;
    }

    setMessage("");
    setSending(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        required
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="พิมพ์ข้อความตอบกลับ..."
        className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className={`w-fit ${buttonClass("primary", "sm")}`}
      >
        {sending ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>
    </form>
  );
}
