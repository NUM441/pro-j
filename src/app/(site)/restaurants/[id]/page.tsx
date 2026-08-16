import Image from "next/image";
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
  const currentUserAvatarUrl: string | null = userData.user?.user_metadata?.avatar_url ?? null;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
      <RestaurantGallery
        restaurantName={restaurant.name}
        coverUrl={restaurant.cover_photo_url}
        foodUrls={restaurant.food_photo_urls}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-2xl font-bold text-slate-900 dark:text-slate-50">
              {restaurant.name}
            </h1>
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
            <span className="text-sm text-slate-500 dark:text-slate-400">
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
                  className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
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
            className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
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

      <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{restaurant.description}</p>

      <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">รีวิว</h2>

        <ReviewForm
          restaurantId={restaurant.id}
          currentUserId={userData.user?.id ?? null}
          currentUserName={currentUserName}
          currentUserAvatarUrl={currentUserAvatarUrl}
          existingReview={existingReview}
        />

        {allReviews.length > 0 && (
          <div className="flex flex-col gap-4">
            {allReviews.map((review) => (
              <div key={review.id} className="border-b border-slate-200 pb-4 last:border-0 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {review.reviewer_avatar_url ? (
                      <span className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-slate-300 dark:border-slate-700">
                        <Image
                          src={review.reviewer_avatar_url}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </span>
                    ) : (
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-100 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="truncate font-medium text-slate-900 dark:text-slate-50">
                      {review.reviewer_name}
                    </span>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
                {review.photo_url && (
                  <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-lg">
                    <Image
                      src={review.photo_url}
                      alt={`รูปรีวิวจาก ${review.reviewer_name}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
