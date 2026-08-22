"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import RestaurantCard, { type RestaurantWithReviews } from "@/components/RestaurantCard";

export default function RestaurantRow({
  title,
  viewAllHref,
  restaurants,
  currentUserId,
  favoritedIds,
}: {
  title: string;
  viewAllHref: string;
  restaurants: RestaurantWithReviews[];
  currentUserId: string | null;
  favoritedIds: Set<string>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (restaurants.length === 0) return null;

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">{title}</h2>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="เลื่อนซ้าย"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="เลื่อนขวา"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            ดูทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="w-56 shrink-0 snap-start sm:w-60">
            <RestaurantCard
              restaurant={restaurant}
              currentUserId={currentUserId}
              isFavorited={favoritedIds.has(restaurant.id)}
              headingLevel="h3"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
