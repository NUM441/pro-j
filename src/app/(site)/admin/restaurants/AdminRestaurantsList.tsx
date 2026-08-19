"use client";

import Image from "next/image";
import { useState } from "react";
import DeleteRestaurantButton from "./DeleteRestaurantButton";

export type AdminRestaurantRow = {
  id: string;
  ownerId: string;
  name: string;
  coverPhotoUrl: string;
  ownerName: string;
  ownerEmail: string;
};

export default function AdminRestaurantsList({ initialRestaurants }: { initialRestaurants: AdminRestaurantRow[] }) {
  const [prevInitialRestaurants, setPrevInitialRestaurants] = useState(initialRestaurants);
  const [restaurants, setRestaurants] = useState(initialRestaurants);

  if (initialRestaurants !== prevInitialRestaurants) {
    setPrevInitialRestaurants(initialRestaurants);
    setRestaurants(initialRestaurants);
  }

  if (restaurants.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
        ยังไม่มีร้านอาหารในระบบ
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {restaurants.map((r) => (
        <div
          key={r.id}
          className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
            <Image src={r.coverPhotoUrl} alt={r.name} fill className="object-cover" unoptimized />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-stone-900 dark:text-stone-50">{r.name}</p>
            <p className="truncate text-sm text-stone-500 dark:text-stone-400">
              เจ้าของ: {r.ownerName || "ไม่พบบัญชี"}
              {r.ownerEmail ? ` · ${r.ownerEmail}` : ""}
            </p>
          </div>
          <DeleteRestaurantButton
            restaurantId={r.id}
            ownerId={r.ownerId}
            restaurantName={r.name}
            onDeleted={() => setRestaurants((prev) => prev.filter((row) => row.id !== r.id))}
          />
        </div>
      ))}
    </div>
  );
}
