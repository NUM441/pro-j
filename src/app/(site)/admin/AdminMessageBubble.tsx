"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ContactMessage } from "@/lib/supabase/messages";

export default function AdminMessageBubble({ message }: { message: ContactMessage }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("ลบข้อความนี้ใช่ไหม? จะหายไปทั้งฝั่งแอดมินและลูกค้า")) return;

    setDeleting(true);
    const res = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: message.id }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setDeleting(false);
    }
  }

  return (
    <div
      className={
        message.is_admin
          ? "relative flex max-w-[80%] flex-col gap-1 rounded-2xl rounded-tl-sm bg-slate-100 py-2 pr-8 pl-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100"
          : "relative ml-auto flex max-w-[80%] flex-col gap-1 rounded-2xl rounded-tr-sm bg-blue-100 py-2 pr-8 pl-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-200"
      }
    >
      {message.image_url && (
        <div className="relative h-40 w-52 overflow-hidden rounded-lg">
          <Image src={message.image_url} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
      {message.message && <span>{message.message}</span>}
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="ลบข้อความ"
        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-black/10 hover:text-red-600 disabled:opacity-50 dark:hover:bg-white/10"
      >
        ×
      </button>
    </div>
  );
}
