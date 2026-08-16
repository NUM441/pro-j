"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RESTAURANT_PHOTOS_BUCKET } from "@/lib/supabase/restaurants";
import { buttonClass } from "@/lib/buttonStyles";

export default function WelcomeImageForm({
  adminUserId,
  currentUrl,
}: {
  adminUserId: string;
  currentUrl: string | null;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${adminUserId}/welcome-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(RESTAURANT_PHOTOS_BUCKET)
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage.from(RESTAURANT_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl;

      const res = await fetch("/api/admin/welcome-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: publicUrl }),
      });
      if (!res.ok) throw new Error("save failed");

      router.refresh();
    } catch {
      setError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setPreview(currentUrl);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    if (!confirm("ต้องการลบรูปหน้า Welcome ใช่ไหม?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/welcome-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: null }),
      });
      if (!res.ok) throw new Error("remove failed");

      setPreview(null);
      router.refresh();
    } catch {
      setError("ลบรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {preview ? (
        <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <Image src={preview} alt="รูปหน้า Welcome" fill className="object-cover" unoptimized />
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          ยังไม่ได้ตั้งรูป — หน้า Welcome จะแสดงอิโมจิ 🎉 แทน
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <label className={`cursor-pointer ${buttonClass("primary", "sm")}`}>
          {loading ? "กำลังอัปโหลด..." : preview ? "เปลี่ยนรูป" : "อัปโหลดรูป"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
        </label>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            className={buttonClass("danger", "sm")}
          >
            ลบรูป
          </button>
        )}
      </div>
    </div>
  );
}
