"use client";

import { useCallback, useEffect, useState } from "react";
import { LocateFixed, MapPinOff, TriangleAlert, UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { distanceKm, NEARBY_RADIUS_KM } from "@/lib/geo";
import { buttonClass } from "@/lib/buttonStyles";
import RestaurantCard, { type RestaurantWithReviews } from "@/components/RestaurantCard";

type NearbyRestaurant = RestaurantWithReviews & { distanceKm: number };

type Status = "locating" | "denied" | "unsupported" | "error" | "ready";

export default function NearbyRestaurantsPage() {
  const [status, setStatus] = useState<Status>(() =>
    typeof navigator === "undefined" || navigator.geolocation ? "locating" : "unsupported",
  );
  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const locate = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const supabase = createClient();

        const [{ data: nearby }, { data: userData }] = await Promise.all([
          supabase
            .from("restaurants")
            .select("*, reviews(rating)")
            .not("latitude", "is", null)
            .not("longitude", "is", null)
            .returns<RestaurantWithReviews[]>(),
          supabase.auth.getUser(),
        ]);

        setCurrentUserId(userData.user?.id ?? null);

        if (userData.user) {
          const { data: favorites } = await supabase
            .from("favorites")
            .select("restaurant_id")
            .eq("user_id", userData.user.id);
          setFavoritedIds(new Set((favorites ?? []).map((f) => f.restaurant_id)));
        }

        const withDistance = (nearby ?? [])
          .map((restaurant) => ({
            ...restaurant,
            distanceKm: distanceKm(
              latitude,
              longitude,
              restaurant.latitude as number,
              restaurant.longitude as number,
            ),
          }))
          .filter((restaurant) => restaurant.distanceKm <= NEARBY_RADIUS_KM)
          .sort((a, b) => a.distanceKm - b.distanceKm);

        setRestaurants(withDistance);
        setStatus("ready");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  useEffect(() => {
    if (navigator.geolocation) locate();
  }, [locate]);

  function retry() {
    setStatus("locating");
    locate();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          ร้านอาหารใกล้ฉัน
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          ค้นหาจากตำแหน่ง GPS ของคุณ แสดงร้านในระยะไม่เกิน {NEARBY_RADIUS_KM} กม. เรียงจากใกล้ที่สุด
        </p>
      </div>

      {status === "locating" && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-stone-50 p-10 text-center text-sm text-stone-500 dark:bg-stone-900 dark:text-stone-400">
          <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
            <LocateFixed className="h-5 w-5 text-stone-400 dark:text-stone-500" />
          </span>
          กำลังขอตำแหน่ง GPS...
        </div>
      )}

      {status === "denied" && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-stone-50 p-10 text-center text-sm text-stone-500 dark:bg-stone-900 dark:text-stone-400">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
            <MapPinOff className="h-5 w-5 text-stone-400 dark:text-stone-500" />
          </span>
          <p>ฟีเจอร์นี้ต้องใช้ตำแหน่ง GPS กรุณาอนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์แล้วลองใหม่</p>
          <button type="button" onClick={retry} className={buttonClass("primary", "sm")}>
            ลองอีกครั้ง
          </button>
        </div>
      )}

      {(status === "unsupported" || status === "error") && (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-stone-50 p-10 text-center text-sm text-stone-500 dark:bg-stone-900 dark:text-stone-400">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
            <TriangleAlert className="h-5 w-5 text-stone-400 dark:text-stone-500" />
          </span>
          <p>
            {status === "unsupported"
              ? "เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง GPS"
              : "ไม่สามารถระบุตำแหน่งได้ กรุณาลองใหม่อีกครั้ง"}
          </p>
          {status === "error" && (
            <button type="button" onClick={retry} className={buttonClass("primary", "sm")}>
              ลองอีกครั้ง
            </button>
          )}
        </div>
      )}

      {status === "ready" &&
        (restaurants.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-stone-50 p-10 text-center text-sm text-stone-500 dark:bg-stone-900 dark:text-stone-400">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
              <UtensilsCrossed className="h-5 w-5 text-stone-400 dark:text-stone-500" />
            </span>
            ไม่พบร้านอาหารในระยะ {NEARBY_RADIUS_KM} กม. จากตำแหน่งของคุณ
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                currentUserId={currentUserId}
                isFavorited={favoritedIds.has(restaurant.id)}
                headingLevel="h2"
                distanceKm={restaurant.distanceKm}
              />
            ))}
          </div>
        ))}
    </main>
  );
}
