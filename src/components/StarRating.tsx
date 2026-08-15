"use client";

const STARS = [1, 2, 3, 4, 5];

type Props = {
  rating: number;
  size?: "sm" | "md";
  onRate?: (rating: number) => void;
};

export default function StarRating({ rating, size = "sm", onRate }: Props) {
  const textSize = size === "md" ? "text-2xl" : "text-sm";

  return (
    <span className={`inline-flex ${textSize} leading-none`}>
      {STARS.map((star) => {
        const filled = star <= Math.round(rating);
        const color = filled ? "text-orange-500" : "text-stone-300 dark:text-stone-600";

        return onRate ? (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className={color}
            aria-label={`ให้ ${star} ดาว`}
          >
            ★
          </button>
        ) : (
          <span key={star} className={color}>
            ★
          </span>
        );
      })}
    </span>
  );
}
