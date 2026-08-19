"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StarRating from "@/components/StarRating";
import { buttonClass } from "@/lib/buttonStyles";
import { RESTAURANT_PHOTOS_BUCKET } from "@/lib/supabase/restaurants";
import type { Review } from "@/lib/supabase/reviews";

type Props = {
  restaurantId: string;
  currentUserId: string | null;
  currentUserName: string;
  currentUserAvatarUrl: string | null;
  existingReview: Review | null;
};

export default function ReviewForm({
  restaurantId,
  currentUserId,
  currentUserName,
  currentUserAvatarUrl,
  existingReview,
}: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(existingReview?.photo_url ?? null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentUserId) {
    return (
      <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
        <Link href="/welcome" className="font-medium text-emerald-700 hover:underline dark:text-emerald-400">
          เข้าสู่ระบบ
        </Link>{" "}
        เพื่อเขียนรีวิว
      </p>
    );
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("กรุณาให้คะแนนดาว");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    let photoUrl = photoPreview ? existingReview?.photo_url ?? null : null;

    if (photoFile) {
      const ext = photoFile.name.split(".").pop() ?? "jpg";
      const path = `${currentUserId}/review-${restaurantId}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(RESTAURANT_PHOTOS_BUCKET)
        .upload(path, photoFile, { upsert: true });

      if (uploadError) {
        setError("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        setLoading(false);
        return;
      }

      photoUrl = supabase.storage.from(RESTAURANT_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl;
    }

    const payload = {
      restaurant_id: restaurantId,
      reviewer_id: currentUserId,
      reviewer_name: currentUserName,
      reviewer_avatar_url: currentUserAvatarUrl,
      rating,
      comment,
      photo_url: photoUrl,
    };

    const { error: dbError } = existingReview
      ? await supabase.from("reviews").update(payload).eq("id", existingReview.id)
      : await supabase.from("reviews").insert(payload);

    if (dbError) {
      setError("บันทึกรีวิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!existingReview) return;
    if (!confirm("ต้องการลบรีวิวนี้ใช่ไหม?")) return;

    setDeleting(true);
    setError(null);

    const supabase = createClient();
    const { error: dbError } = await supabase.from("reviews").delete().eq("id", existingReview.id);

    if (dbError) {
      setError("ลบรีวิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setDeleting(false);
      return;
    }

    setRating(0);
    setComment("");
    setPhotoFile(null);
    setPhotoPreview(null);
    router.refresh();
    setDeleting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">ให้คะแนน</span>
        <StarRating rating={rating} size="md" onRate={setRating} />
      </div>

      <textarea
        required
        rows={3}
        placeholder="เล่าประสบการณ์ของคุณที่ร้านนี้..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">แนบรูป (ถ้ามี)</span>
        {photoPreview ? (
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800">
            <Image src={photoPreview} alt="รูปรีวิว" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-black/70 text-white"
              aria-label="ลบรูปนี้"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm" />
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || deleting}
          className={buttonClass("primary", "sm")}
        >
          {loading ? "กำลังบันทึก..." : existingReview ? "แก้ไขรีวิว" : "ส่งรีวิว"}
        </button>

        {existingReview && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || deleting}
            className={buttonClass("danger", "sm")}
          >
            {deleting ? "กำลังลบ..." : "ลบรีวิว"}
          </button>
        )}
      </div>
    </form>
  );
}
