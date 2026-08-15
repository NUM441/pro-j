export const MAX_FOOD_PHOTOS = 5;
export const RESTAURANT_PHOTOS_BUCKET = "restaurant-photos";

export type Restaurant = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  google_maps_url: string;
  cover_photo_url: string;
  food_photo_urls: string[];
  created_at: string;
};
