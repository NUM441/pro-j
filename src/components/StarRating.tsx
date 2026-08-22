"use client";

import { Star } from "lucide-react";

const STARS = [1, 2, 3, 4, 5];

type Props = {
  rating: number;
  size?: "sm" | "md";
  onRate?: (rating: number) => void;
};

export default function StarRating({ rating, size = "sm", onRate }: Props) {
  const iconSize = size === "md" ? "h-6 w-6" : "h-4 w-4";
  const gap = size === "md" ? "gap-1" : "gap-0.5";

  return (
    <span className={`inline-flex ${gap} leading-none`}>
      {STARS.map((star) => {
        const filled = star <= Math.round(rating);
        const color = filled ? "fill-amber-400 text-amber-400" : "fill-none text-stone-300 dark:text-stone-600";

        return onRate ? (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className="p-0.5"
            aria-label={`ให้ ${star} ดาว`}
          >
            <Star className={`${iconSize} ${color}`} />
          </button>
        ) : (
          <Star key={star} className={`${iconSize} ${color}`} />
        );
      })}
    </span>
  );
}
