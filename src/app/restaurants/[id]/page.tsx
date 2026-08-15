import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/supabase/restaurants";
import { averageRating, type Review } from "@/lib/supabase/reviews";
import StarRating from "@/components/StarRating";
import ReviewForm from "./ReviewForm";

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
      <div className="relative h-64 w-full overflow-hidden rounded-2xl">
        <Image src={restaurant.cover_photo_url} alt={restaurant.name} fill className="object-cover" unoptimized />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{restaurant.name}</h1>
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
                  className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-950 dark:text-orange-300"
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
            className="text-sm font-medium text-orange-600 hover:underline dark:text-orange-400"
          >
            เปิดใน Google Maps ↗
          </a>
        </div>
        {isOwner && (
          <Link
            href={`/profile/restaurants/${restaurant.id}/edit`}
            className="flex-shrink-0 rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            แก้ไขร้าน
          </Link>
        )}
      </div>

      <p className="whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">{restaurant.description}</p>

      {restaurant.food_photo_urls.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-50">รูปอาหาร</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {restaurant.food_photo_urls.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={url}
                  alt={`${restaurant.name} รูปอาหาร ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

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
