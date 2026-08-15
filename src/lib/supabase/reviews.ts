export type Review = {
  id: string;
  restaurant_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
};

export function averageRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
