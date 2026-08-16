"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/lib/buttonStyles";

export default function DeleteRestaurantButton({
  restaurantId,
  ownerId,
  restaurantName,
}: {
  restaurantId: string;
  ownerId: string;
  restaurantName: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm(`ต้องการลบร้าน "${restaurantName}" ใช่ไหม? รีวิว รายการโปรด และการจองของร้านนี้จะถูกลบไปด้วย`)) {
      return;
    }

    setDeleting(true);
    setError(null);

    const res = await fetch("/api/admin/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, ownerId }),
    });

    if (!res.ok) {
      setError("ลบร้านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <button type="button" onClick={handleDelete} disabled={deleting} className={buttonClass("danger", "sm")}>
        {deleting ? "กำลังลบ..." : "ลบร้าน"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
