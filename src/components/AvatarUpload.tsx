"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AVATARS_BUCKET = "avatars";

type Props = {
  userId: string;
  avatarUrl: string | null;
  name: string;
};

export default function AvatarUpload({ userId, avatarUrl, name }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
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
      const path = `${userId}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(AVATARS_BUCKET)
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path).data.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      if (updateError) throw updateError;

      router.refresh();
    } catch {
      setError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setPreview(avatarUrl);
    } finally {
      setLoading(false);
    }
  }

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-stone-200 bg-amber-100 text-2xl font-semibold text-amber-700 disabled:opacity-60 dark:border-stone-800 dark:bg-amber-950 dark:text-amber-300"
        aria-label="เปลี่ยนรูปโปรไฟล์"
      >
        {preview ? (
          <Image src={preview} alt={name} fill className="object-cover" unoptimized />
        ) : (
          <span className="flex h-full w-full items-center justify-center">{initial}</span>
        )}
      </button>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-fit rounded-full border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-60 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950"
        >
          {loading ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
