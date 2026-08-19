"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  restaurantId: string;
  userId: string;
  initialFavorited: boolean;
  className?: string;
  iconClassName?: string;
};

export default function FavoriteButton({
  restaurantId,
  userId,
  initialFavorited,
  className,
  iconClassName,
}: Props) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const supabase = createClient();
    const next = !favorited;
    setFavorited(next);

    if (next) {
      await supabase.from("favorites").insert({ user_id: userId, restaurant_id: restaurantId });
    } else {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("restaurant_id", restaurantId);
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={favorited ? "เอาออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 transition disabled:opacity-60 dark:border-stone-700 ${className ?? ""}`}
    >
      <Heart
        className={`h-4 w-4 ${favorited ? "fill-red-500 text-red-500" : (iconClassName ?? "fill-none text-stone-500 dark:text-stone-400")}`}
      />
    </button>
  );
}
