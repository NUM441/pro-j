import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/supabase/restaurants";
import { averageRating, type Review } from "@/lib/supabase/reviews";
import StarRating from "@/components/StarRating";
import RestaurantGallery from "@/components/RestaurantGallery";
import { buttonClass } from "@/lib/buttonStyles";
import FavoriteButton from "@/components/FavoriteButton";
import ReviewForm from "./ReviewForm";
import ReservationForm from "./ReservationForm";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: restaurant }, { data: userData }, { data: reviews }] = await Promise.all([
    supabase.from("restaurants").select("*").eq("id", id).single<Restaurant>(),
    supabase.auth.getUser(),
    supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", id)
      .order("created_at", { ascending: false })
      .returns<Review[]>(),
  ]);

  if (!restaurant) {
    notFound();
  }

  let isFavorited = false;
  if (userData.user) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userData.user.id)
      .eq("restaurant_id", restaurant.id)
      .maybeSingle();
    isFavorited = !!favorite;
  }

  const isOwner = userData.user?.id === restaurant.owner_id;
  const allReviews = reviews ?? [];
  const reviewCount = allReviews.length;
  const avgRating = averageRating(allReviews);
  const existingReview =
    allReviews.find((r) => r.reviewer_id === userData.user?.id) ?? null;
  const currentUserName =
    userData.user?.user_metadata?.full_name ?? userData.user?.email ?? "";

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
      <RestaurantGallery
        restaurantName={restaurant.name}
        coverUrl={restaurant.cover_photo_url}
        foodUrls={restaurant.food_photo_urls}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{restaurant.name}</h1>
            {userData.user && (
              <FavoriteButton
                restaurantId={restaurant.id}
                userId={userData.user.id}
                initialFavorited={isFavorited}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={avgRating} />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {reviewCount > 0
                ? `${avgRating.toFixed(1)} (${reviewCount} รีวิว)`
                : "ยังไม่มีรีวิว"}
            </span>
          </div>
          {restaurant.categories.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {restaurant.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
          <a
            href={restaurant.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-green-700 hover:underline dark:text-green-400"
          >
            เปิดใน Google Maps ↗
          </a>
        </div>
        {isOwner && (
          <Link
            href={`/profile/restaurants/${restaurant.id}/edit`}
            className={`flex-shrink-0 ${buttonClass("secondary", "sm")}`}
          >
            แก้ไขร้าน
          </Link>
        )}
      </div>

      <ReservationForm
        restaurantId={restaurant.id}
        currentUserId={userData.user?.id ?? null}
        currentUserName={currentUserName}
      />

      <p className="whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">{restaurant.description}</p>

      <div className="flex flex-col gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">รีวิว</h2>

        <ReviewForm
          restaurantId={restaurant.id}
          currentUserId={userData.user?.id ?? null}
          currentUserName={currentUserName}
          existingReview={existingReview}
        />

        {allReviews.length > 0 && (
          <div className="flex flex-col gap-4">
            {allReviews.map((review) => (
              <div key={review.id} className="border-b border-neutral-200 pb-4 last:border-0 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900 dark:text-neutral-50">
                    {review.reviewer_name}
                  </span>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
