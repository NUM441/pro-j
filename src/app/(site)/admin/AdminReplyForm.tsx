"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/lib/buttonStyles";
import { RESTAURANT_PHOTOS_BUCKET } from "@/lib/supabase/restaurants";

export default function AdminReplyForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    setSending(true);
    setError(null);

    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("unauthorized");

        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/chat-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(RESTAURANT_PHOTOS_BUCKET)
          .upload(path, imageFile, { upsert: true });
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from(RESTAURANT_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl;
      }

      const res = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message, imageUrl }),
      });

      if (!res.ok) throw new Error("send failed");

      setMessage("");
      handleRemoveImage();
      router.refresh();
    } catch {
      setError("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {imagePreview && (
        <div className="relative h-20 w-20">
          <div className="relative h-full w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
            <Image src={imagePreview} alt="" fill className="object-cover" unoptimized />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white"
            aria-label="ลบรูป"
          >
            ×
          </button>
        </div>
      )}
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="พิมพ์ข้อความตอบกลับ..."
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center gap-3">
        <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-300 text-sm dark:border-slate-700">
          📎
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        <button
          type="submit"
          disabled={sending}
          className={`w-fit ${buttonClass("primary", "sm")}`}
        >
          {sending ? "กำลังส่ง..." : "ส่งข้อความ"}
        </button>
      </div>
    </form>
  );
}
