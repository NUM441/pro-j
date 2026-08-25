"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
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
  const drag = useRef({ isDown: false, startX: 0, startScrollLeft: 0, moved: false });

  if (restaurants.length === 0) return null;

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { isDown: true, startX: e.clientX, startScrollLeft: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.isDown) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScrollLeft - dx;
  }

  function handlePointerUp() {
    if (drag.current.isDown && drag.current.moved) {
      const el = scrollRef.current;
      const suppressClick = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      el?.addEventListener("click", suppressClick, { capture: true, once: true });
    }
    drag.current.isDown = false;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">{title}</h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
        >
          ดูทั้งหมด <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 select-none active:cursor-grabbing sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
