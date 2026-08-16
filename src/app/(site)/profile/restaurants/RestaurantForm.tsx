"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CATEGORIES,
  MAX_FOOD_PHOTOS,
  RESTAURANT_PHOTOS_BUCKET,
  type Restaurant,
} from "@/lib/supabase/restaurants";
import { buttonClass, chipClass } from "@/lib/buttonStyles";

type FoodPhoto =
  | { type: "existing"; url: string }
  | { type: "new"; file: File; previewUrl: string };

type Props =
  | { mode: "new"; ownerId: string; restaurant?: undefined }
  | { mode: "edit"; ownerId: string; restaurant: Restaurant };

function fileExtension(file: File) {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop() : "jpg";
}

export default function RestaurantForm({ mode, ownerId, restaurant }: Props) {
  const router = useRouter();

  const [name, setName] = useState(restaurant?.name ?? "");
  const [description, setDescription] = useState(restaurant?.description ?? "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState(restaurant?.google_maps_url ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    restaurant?.categories ?? [],
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    restaurant?.cover_photo_url ?? null,
  );
  const [foodPhotos, setFoodPhotos] = useState<FoodPhoto[]>(
    (restaurant?.food_photo_urls ?? []).map((url) => ({ type: "existing", url })),
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  }

  function handleFoodFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const remainingSlots = MAX_FOOD_PHOTOS - foodPhotos.length;
    const toAdd = selected.slice(0, remainingSlots);
    setFoodPhotos((prev) => [
      ...prev,
      ...toAdd.map((file) => ({
        type: "new" as const,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
    e.target.value = "";
  }

  function removeFoodPhoto(index: number) {
    setFoodPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  }

  async function uploadImage(
    supabase: ReturnType<typeof createClient>,
    file: File,
    path: string,
  ) {
    const { error } = await supabase.storage
      .from(RESTAURANT_PHOTOS_BUCKET)
      .upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from(RESTAURANT_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "new" && !coverFile) {
      setError("กรุณาเลือกรูปหน้าร้าน");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const restaurantId = restaurant?.id ?? crypto.randomUUID();

      let coverPhotoUrl = restaurant?.cover_photo_url ?? "";
      if (coverFile) {
        coverPhotoUrl = await uploadImage(
          supabase,
          coverFile,
          `${ownerId}/${restaurantId}/cover-${Date.now()}.${fileExtension(coverFile)}`,
        );
      }

      const foodPhotoUrls: string[] = [];
      for (const [i, photo] of foodPhotos.entries()) {
        if (photo.type === "existing") {
          foodPhotoUrls.push(photo.url);
        } else {
          const url = await uploadImage(
            supabase,
            photo.file,
            `${ownerId}/${restaurantId}/food-${Date.now()}-${i}.${fileExtension(photo.file)}`,
          );
          foodPhotoUrls.push(url);
        }
      }

      const payload = {
        name,
        description,
        google_maps_url: googleMapsUrl,
        cover_photo_url: coverPhotoUrl,
        food_photo_urls: foodPhotoUrls,
        categories: selectedCategories,
      };

      const { error: dbError } =
        mode === "new"
          ? await supabase
              .from("restaurants")
              .insert({ id: restaurantId, owner_id: ownerId, ...payload })
          : await supabase.from("restaurants").update(payload).eq("id", restaurantId);

      if (dbError) throw dbError;

      router.push("/profile");
      router.refresh();
    } catch {
      setError("บันทึกร้านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!restaurant) return;
    if (!confirm(`ต้องการลบร้าน "${restaurant.name}" ใช่ไหม?`)) return;

    setDeleting(true);
    setError(null);

    try {
      const supabase = createClient();
      const folder = `${ownerId}/${restaurant.id}`;
      const { data: files } = await supabase.storage
        .from(RESTAURANT_PHOTOS_BUCKET)
        .list(folder);
      if (files && files.length > 0) {
        await supabase.storage
          .from(RESTAURANT_PHOTOS_BUCKET)
          .remove(files.map((f) => `${folder}/${f.name}`));
      }

      const { error: dbError } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", restaurant.id);
      if (dbError) throw dbError;

      router.push("/profile");
      router.refresh();
    } catch {
      setError("ลบร้านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          ชื่อร้าน
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          รายละเอียดร้าน
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ประเภทอาหาร</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => {
            const active = selectedCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={chipClass(active)}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="googleMapsUrl" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          ลิงก์ Google Maps
        </label>
        <input
          id="googleMapsUrl"
          type="url"
          required
          placeholder="https://maps.app.goo.gl/..."
          value={googleMapsUrl}
          onChange={(e) => setGoogleMapsUrl(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">รูปหน้าร้าน</span>
        {coverPreviewUrl && (
          <div className="relative h-40 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
            <Image src={coverPreviewUrl} alt="รูปหน้าร้าน" fill className="object-cover" unoptimized />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleCoverChange} className="text-sm" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          รูปอาหาร (สูงสุด {MAX_FOOD_PHOTOS} รูป)
        </span>
        {foodPhotos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {foodPhotos.map((photo, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <Image
                  src={photo.type === "existing" ? photo.url : photo.previewUrl}
                  alt={`รูปอาหาร ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeFoodPhoto(i)}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-black/70 text-xs text-white"
                  aria-label="ลบรูปนี้"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {foodPhotos.length < MAX_FOOD_PHOTOS && (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFoodFilesChange}
            className="text-sm"
          />
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || deleting}
          className={buttonClass("primary")}
        >
          {loading ? "กำลังบันทึก..." : mode === "new" ? "บันทึกร้าน" : "บันทึกการแก้ไข"}
        </button>

        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || deleting}
            className={buttonClass("danger")}
          >
            {deleting ? "กำลังลบ..." : "ลบร้านนี้"}
          </button>
        )}
      </div>
    </form>
  );
}
