"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  restaurantId: string;
  userId: string;
  initialFavorited: boolean;
  className?: string;
};

export default function FavoriteButton({ restaurantId, userId, initialFavorited, className }: Props) {
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
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-lg transition disabled:opacity-60 dark:border-stone-700 ${className ?? ""}`}
    >
      {favorited ? "❤️" : "🤍"}
    </button>
  );
}
