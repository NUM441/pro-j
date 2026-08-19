"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { buttonClass } from "@/lib/buttonStyles";

export default function DeleteConversationButton({
  userId,
  userName,
  compact = false,
  redirectAfter = false,
  onDeleted,
}: {
  userId: string;
  userName: string;
  compact?: boolean;
  redirectAfter?: boolean;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        `ต้องการลบข้อความทั้งหมดกับ "${userName}" ใช่ไหม? ข้อความจะหายไปทั้งฝั่งแอดมินและลูกค้า และกู้คืนไม่ได้`,
      )
    ) {
      return;
    }

    setError(null);

    if (onDeleted) {
      onDeleted();
    } else {
      setDeleting(true);
    }

    const res = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      if (onDeleted) {
        router.refresh();
      } else {
        setError("ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        setDeleting(false);
      }
      return;
    }

    if (redirectAfter) {
      router.push("/admin");
    } else if (!onDeleted) {
      router.refresh();
    }
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="ลบแชท"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition hover:border-red-300 hover:text-red-600 disabled:opacity-50 dark:border-stone-700"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={handleDelete} disabled={deleting} className={buttonClass("danger", "sm")}>
        {deleting ? "กำลังลบ..." : "ลบแชท"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
